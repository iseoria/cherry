// src/lib/ai/yoloSession.ts
import { Asset } from 'expo-asset';
import { InferenceSession, Tensor } from 'onnxruntime-react-native';

// 카메라/웹RTC 프레임 타입
export type FrameLike = {
  data: Uint8Array; // RGBA: width * height * 4
  width: number;
  height: number;
};

let session: InferenceSession | null = null;

export async function getYoloSession() {
  if (session) return session;

  const modelAsset = Asset.fromModule(
    require('../../assets/models/yolov8n-pose.onnx')
  );

  if (!modelAsset.localUri) {
    await modelAsset.downloadAsync();
  }

  const modelUri = modelAsset.localUri || modelAsset.uri;

  // onnxruntime-react-native는 보통 uri(string)도 받음
  session = await InferenceSession.create(modelUri);

  return session;
}

/**
 * 프레임(RGBA) → YOLO 입력 텐서로 전처리
 * - 여기서는 1x3xH xW (CHW) 기준으로 예시 구현
 * - 실제 모델 입력 shape / 정규화 방식에 맞게 조정해야 함
 */
function preprocessFrameToTensor(frame: FrameLike): Tensor {
  const { width, height, data } = frame;

  // CHW: [C, H, W]
  const chw = new Float32Array(3 * width * height);

  for (let i = 0; i < width * height; i++) {
    const r = data[i * 4 + 0];
    const g = data[i * 4 + 1];
    const b = data[i * 4 + 2];

    // [0,1] 정규화 예시
    const fr = r / 255;
    const fg = g / 255;
    const fb = b / 255;

    // 채널별로 연속 저장
    // R 채널
    chw[i] = fr;
    // G 채널
    chw[width * height + i] = fg;
    // B 채널
    chw[2 * width * height + i] = fb;
  }

  return new Tensor('float32', chw, [1, 3, height, width]);
}

/**
 * ✅ 메인 함수: 프레임 하나에 대해 YOLO ONNX 추론 실행
 * - 아직 output 구조는 모르니까 any로 두고, CameraMode 쪽에서 parseKeypointsFromYolo(...)로 처리
 */
export async function runYoloOnFrame(frame: FrameLike): Promise<any> {
  const sess = await getYoloSession();
  const inputTensor = preprocessFrameToTensor(frame);

  // input 이름은 onnx 모델에 따라 다름 (예: "images", "input_0"...)
  const feeds: Record<string, Tensor> = {
    images: inputTensor,
  };

  const output = await sess.run(feeds);
  return output;
}
