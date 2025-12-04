import { Asset } from "expo-asset";
import { InferenceSession, Tensor } from "onnxruntime-react-native";
import type { Keypoint } from "./motionDetection";

// VisionCamera / 기타에서 넘겨줄 프레임 타입
// - data: RGB(3채널) 또는 RGBA(4채널) raw bytes
export type FrameLike = {
  width: number;
  height: number;
  data: Uint8Array;
  channels: 3 | 4;
};

// YOLO 바운딩 박스 정보
export interface YoloBbox {
  x: number; // center-x (모델 좌표계 기준)
  y: number; // center-y
  w: number; // width
  h: number; // height
  score: number; // confidence
  classId: number;
}

// 한 객체(사람)의 포즈: bbox + keypoints
export interface PoseDetection {
  bbox: YoloBbox;
  keypoints: Keypoint[]; // [x, y, score?] 배열
}

let session: InferenceSession | null = null;

// ──────────────────────────────────────
// 1) ONNX 세션 로딩/공유
// ──────────────────────────────────────

export async function getYoloSession(): Promise<InferenceSession> {
  if (session) return session;

  // Expo asset으로 yolov8n-pose.onnx 로딩
  const modelAsset = Asset.fromModule(
    require("../../assets/models/yolov8n-pose.onnx")
  );

  if (!modelAsset.localUri) {
    await modelAsset.downloadAsync();
  }

  const modelUri = modelAsset.localUri || modelAsset.uri;
  session = await InferenceSession.create(modelUri);

  return session;
}

// 외부에서 "모델 준비됐는지" 체크용
export async function loadYoloModel(): Promise<void> {
  await getYoloSession();
}

// ──────────────────────────────────────
// 2) FrameLike → 1x3xHxW 텐서 전처리
// ──────────────────────────────────────

function preprocessFrameToTensor(frame: FrameLike): Tensor {
  const { width, height, data, channels } = frame;

  if (channels !== 3 && channels !== 4) {
    throw new Error(`지원하지 않는 채널 수: ${channels}`);
  }

  const pixelCount = width * height;
  const chw = new Float32Array(3 * pixelCount); // [C,H,W]

  for (let i = 0; i < pixelCount; i++) {
    const base = i * channels;

    const r = data[base + 0];
    const g = data[base + 1];
    const b = data[base + 2];

    const fr = r / 255;
    const fg = g / 255;
    const fb = b / 255;

    // R 채널
    chw[i] = fr;
    // G 채널
    chw[pixelCount + i] = fg;
    // B 채널
    chw[2 * pixelCount + i] = fb;
  }

  // [1, 3, H, W]
  return new Tensor("float32", chw, [1, 3, height, width]);
}

// ──────────────────────────────────────
// 3) YOLOv8n-pose ONNX 출력 파싱
//    - 입력 이름: "images"
//    - 출력 이름: "output0" (없으면 첫 번째 output)
//    - 출력 shape: [1, 56, N] 또는 [1, N, 56]
//      56 = 4(box) + 1(conf) + 3 * 17(keypoints)
// ──────────────────────────────────────

/**
 * ✅ 메인 함수: FrameLike 하나에 대해 YOLOv8n-pose ONNX 추론 실행
 * - VisionCamera에서 RGB 버퍼를 받아 FrameLike { channels: 3 }로 넘기면 됨
 * - 반환: PoseDetection[] (bbox + 17개 keypoints)
 */
export async function runYoloOnFrame(
  frame: FrameLike,
  confThreshold = 0.25
): Promise<PoseDetection[]> {
  const sess = await getYoloSession();
  const inputTensor = preprocessFrameToTensor(frame);

  // yolov8n-pose.onnx 기준 input 이름은 "images"
  const feeds: Record<string, Tensor> = {
    images: inputTensor,
  };

  const outputs = await sess.run(feeds);

  // 출력 이름: 보통 "output0", 없으면 첫 번째 output 사용
  const outTensor = (outputs["output0"] ??
    outputs[Object.keys(outputs)[0]]) as Tensor;

  const data = outTensor.data as Float32Array;
  const dims = outTensor.dims; // [1, 56, N] or [1, N, 56]

  if (dims.length !== 3) {
    throw new Error(`예상과 다른 YOLO 출력 차원: ${dims.join("x")}`);
  }

  const [batch, d1, d2] = dims;
  if (batch !== 1) {
    console.warn("YOLO 배치 크기가 1이 아님:", batch);
  }

  const FEAT_DIM = 56; // 4 + 1 + 3*17
  const NUM_KEYPOINTS = 17;

  let numDet: number;
  let featuresFirst: boolean; // true: [1, 56, N], false: [1, N, 56]

  if (d1 === FEAT_DIM) {
    // [1, 56, N] (channels first)
    featuresFirst = true;
    numDet = d2;
  } else if (d2 === FEAT_DIM) {
    // [1, N, 56] (detections first)
    featuresFirst = false;
    numDet = d1;
  } else {
    throw new Error(
      `YOLOv8n-pose featDim(56)과 맞지 않음. dims=${dims.join("x")}`
    );
  }

  const detections: PoseDetection[] = [];

  // 내부 값 읽는 helper
  const getVal = (detIndex: number, featIndex: number): number => {
    if (featuresFirst) {
      // [1, 56, N] → CxN
      const idx = featIndex * numDet + detIndex;
      return data[idx];
    } else {
      // [1, N, 56] → NxC
      const idx = detIndex * FEAT_DIM + featIndex;
      return data[idx];
    }
  };

  for (let i = 0; i < numDet; i++) {
    const cx = getVal(i, 0);
    const cy = getVal(i, 1);
    const w = getVal(i, 2);
    const h = getVal(i, 3);
    const conf = getVal(i, 4);

    if (conf < confThreshold) continue;

    const keypoints: Keypoint[] = [];
    for (let k = 0; k < NUM_KEYPOINTS; k++) {
      const baseFeat = 5 + k * 3;
      const kx = getVal(i, baseFeat);
      const ky = getVal(i, baseFeat + 1);
      const ks = getVal(i, baseFeat + 2);
      keypoints.push([kx, ky, ks]);
    }

    const bbox: YoloBbox = {
      x: cx,
      y: cy,
      w,
      h,
      score: conf,
      classId: 0, // 클래스 하나만 쓴다고 가정
    };

    detections.push({ bbox, keypoints });
  }

  return detections;
}
