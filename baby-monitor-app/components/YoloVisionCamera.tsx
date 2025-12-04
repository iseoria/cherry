// VisionCamera + Frame Processor로 1초에 한 번씩 RGB 버퍼를 뽑아서
// yoloSession.ts의 runYoloOnFrame(...)으로 포즈(키포인트) 추론하고
// motionDetection.ts로 뒤척임까지 감지 + 화면에 관절/뼈대 오버레이

import React, {
  useCallback,
  useEffect,
  useState,
} from "react";
import { View, Text, StyleSheet, LayoutChangeEvent } from "react-native";
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useFrameProcessor,
  runAtTargetFps,
} from "react-native-vision-camera";
import { runOnJS } from "react-native-reanimated";

import {
  FrameLike,
  runYoloOnFrame,
  loadYoloModel,
  PoseDetection,
} from "../lib/ai/yoloSession";
import {
  detectMotionFromKeypoints,
  type MotionResult,
} from "../lib/ai/motionDetection";

// ✅ 새로 추가: SVG로 그리기
import Svg, { Circle, Line } from "react-native-svg";

const TARGET_FPS = 1; // 1초에 한 번 추론

// ✅ YOLOv8-pose(17 keypoints) 기준 스켈레톤 연결 인덱스
// 0: nose
// 1: left eye, 2: right eye
// 3: left ear, 4: right ear
// 5: left shoulder, 6: right shoulder
// 7: left elbow, 8: right elbow
// 9: left wrist, 10: right wrist
// 11: left hip, 12: right hip
// 13: left knee, 14: right knee
// 15: left ankle, 16: right ankle
const SKELETON_EDGES: [number, number][] = [
  [5, 6],
  [5, 7],
  [7, 9],
  [6, 8],
  [8, 10],
  [5, 11],
  [6, 12],
  [11, 12],
  [11, 13],
  [13, 15],
  [12, 14],
  [14, 16],
];

export default function YoloVisionCamera() {
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice("back");

  const [isModelReady, setIsModelReady] = useState(false);
  const [lastInferenceMs, setLastInferenceMs] = useState<number | null>(null);
  const [lastRunAt, setLastRunAt] = useState<Date | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [lastDetections, setLastDetections] = useState<PoseDetection[]>([]);
  const [lastMotion, setLastMotion] = useState<MotionResult | null>(null);

  // ✅ 추가: 화면(View) 크기 + 프레임 크기
  const [viewSize, setViewSize] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });
  const [frameSize, setFrameSize] = useState<{
    width: number;
    height: number;
  } | null>(null);

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setViewSize({ width, height });
  };

  // ──────────────────────────────────────
  // 1) 카메라 권한 + YOLO 모델 로딩
  // ──────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        if (!hasPermission) {
          await requestPermission();
        }
      } catch (e) {
        console.warn("카메라 권한 요청 실패:", e);
        setErrorMessage("카메라 권한 요청에 실패했습니다.");
      }
    })();
  }, [hasPermission, requestPermission]);

  useEffect(() => {
    (async () => {
      try {
        await loadYoloModel();
        setIsModelReady(true);
        console.log("YOLO 모델 로딩 완료");
      } catch (err) {
        console.error("YOLO 모델 로딩 실패:", err);
        setErrorMessage("YOLO 모델 로딩 실패");
      }
    })();
  }, []);

  // ──────────────────────────────────────
  // 2) JS 스레드에서 YOLO + 뒤척임 수행 함수
  // ──────────────────────────────────────
  const processFrameOnJS = useCallback(
    async (payload: { width: number; height: number; bytes: number[] }) => {
      try {
        if (!isModelReady) return;

        const started = Date.now();

        const data = new Uint8Array(payload.bytes);
        const frame: FrameLike = {
          width: payload.width,
          height: payload.height,
          data,
          channels: 3, // VisionCamera pixelFormat='rgb'
        };

        // ✅ 프레임 크기 저장 (좌표 스케일링용)
        setFrameSize({ width: frame.width, height: frame.height });

        // 🔹 YOLOv8n-pose ONNX 추론 → PoseDetection[]
        const detections = await runYoloOnFrame(frame);

        const ended = Date.now();
        setLastInferenceMs(ended - started);
        setLastRunAt(new Date());
        setErrorMessage(null);
        setLastDetections(detections);

        // 🔹 뒤척임 로직: 가장 conf 높은 포즈 하나만 사용
        if (detections.length > 0) {
          const mainPose = detections.reduce((best, cur) =>
            cur.bbox.score > best.bbox.score ? cur : best
          );
          const motion = detectMotionFromKeypoints(mainPose.keypoints);
          setLastMotion(motion);
          console.log("Motion result:", motion);
        } else {
          setLastMotion(null);
        }
      } catch (err: any) {
        console.error("YOLO 추론 실패:", err);
        setErrorMessage(String(err?.message ?? err));
      }
    },
    [isModelReady]
  );

  // ──────────────────────────────────────
  // 3) Frame Processor: 1초에 한 번 프레임 → ArrayBuffer 추출
  // ──────────────────────────────────────
  const frameProcessor = useFrameProcessor(
    (frame) => {
      "worklet";

      if (frame.pixelFormat !== "rgb") {
        return;
      }

      runAtTargetFps(TARGET_FPS, () => {
        "worklet";

        const buffer = frame.toArrayBuffer();
        const bytes = Array.from(new Uint8Array(buffer));

        runOnJS(processFrameOnJS)({
          width: frame.width,
          height: frame.height,
          bytes,
        });
      });
    },
    [processFrameOnJS]
  );

  // ──────────────────────────────────────
  // 4) YOLO 키포인트/스켈레톤 오버레이 렌더 함수
  // ──────────────────────────────────────
  const renderPosesOverlay = () => {
    if (
      viewSize.width === 0 ||
      viewSize.height === 0 ||
      !frameSize ||
      lastDetections.length === 0
    ) {
      return null;
    }

    const sx = viewSize.width / frameSize.width;
    const sy = viewSize.height / frameSize.height;

    return (
      <Svg
        pointerEvents="none"
        style={StyleSheet.absoluteFill}
        viewBox={`0 0 ${viewSize.width} ${viewSize.height}`}
      >
        {lastDetections.map((det, detIdx) => {
          const kps = det.keypoints;

          // 🔸 뼈대(선)
          const lines = SKELETON_EDGES.map(([i, j], idx) => {
            const kp1 = kps[i];
            const kp2 = kps[j];
            if (!kp1 || !kp2) return null;

            const [x1Raw, y1Raw, s1] = kp1;
            const [x2Raw, y2Raw, s2] = kp2;

            // YOLO 좌표가 [0,1] 정규화인지, [0,W]/[0,H] 픽셀인지 모를 수 있어서
            // 둘 다 대응: 1 이하이면 정규화, 아니면 픽셀이라고 가정
            const isNorm1 = x1Raw <= 1 && y1Raw <= 1;
            const isNorm2 = x2Raw <= 1 && y2Raw <= 1;

            const x1 = isNorm1 ? x1Raw * viewSize.width : x1Raw * sx;
            const y1 = isNorm1 ? y1Raw * viewSize.height : y1Raw * sy;
            const x2 = isNorm2 ? x2Raw * viewSize.width : x2Raw * sx;
            const y2 = isNorm2 ? y2Raw * viewSize.height : y2Raw * sy;

            if ((s1 ?? 1) < 0.2 || (s2 ?? 1) < 0.2) return null;

            return (
              <Line
                key={`line-${detIdx}-${idx}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="lime"
                strokeWidth={2}
              />
            );
          });

          // 🔹 관절 점
          const circles = kps.map((kp, kpIdx) => {
            if (!kp) return null;
            const [xRaw, yRaw, score] = kp;
            if ((score ?? 1) < 0.2) return null;

            const isNorm = xRaw <= 1 && yRaw <= 1;
            const cx = isNorm ? xRaw * viewSize.width : xRaw * sx;
            const cy = isNorm ? yRaw * viewSize.height : yRaw * sy;

            return (
              <Circle
                key={`kp-${detIdx}-${kpIdx}`}
                cx={cx}
                cy={cy}
                r={3}
                fill="red"
              />
            );
          });

          return (
            <React.Fragment key={`pose-${detIdx}`}>
              {lines}
              {circles}
            </React.Fragment>
          );
        })}
      </Svg>
    );
  };

  // ──────────────────────────────────────
  // 5) 렌더링
  // ──────────────────────────────────────
  if (!device) {
    return (
      <View style={styles.center}>
        <Text style={styles.infoText}>사용 가능한 카메라를 찾지 못했습니다.</Text>
      </View>
    );
  }

  if (!hasPermission) {
    return (
      <View style={styles.center}>
        <Text style={styles.infoText}>
          카메라 권한이 없습니다. 설정에서 허용해 주세요.
        </Text>
      </View>
    );
  }

  const turnsText =
    lastMotion?.turns != null ? `${lastMotion.turns}회` : "데이터 없음";

  const movementText =
    lastMotion?.movement != null
      ? lastMotion.movement.toFixed(2)
      : "데이터 없음";

  const isTurnText =
    lastMotion?.isTurn != null ? (lastMotion.isTurn ? "YES" : "NO") : "-";

  return (
    <View style={styles.container} onLayout={onLayout}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        pixelFormat="rgb" // ⚠️ YOLO용 RGB 버퍼
        frameProcessor={frameProcessor}
        enableFpsGraph
      />

      {/* ✅ 카메라 위에 포즈 오버레이 */}
      {renderPosesOverlay()}

      {/* 기존 텍스트 오버레이 */}
      <View style={styles.overlay}>
        <Text style={styles.status}>
          YOLO 모델: {isModelReady ? "✅ 로딩 완료" : "⏳ 로딩 중"}
        </Text>
        <Text style={styles.status}>
          추론 주기: {TARGET_FPS} FPS (≈ {Math.round(1000 / TARGET_FPS)}ms)
        </Text>
        <Text style={styles.status}>
          마지막 추론 시간:{" "}
          {lastInferenceMs != null ? `${lastInferenceMs} ms` : "아직 없음"}
        </Text>
        <Text style={styles.status}>
          마지막 추론 시각:{" "}
          {lastRunAt ? lastRunAt.toLocaleTimeString() : "아직 없음"}
        </Text>
        <Text style={styles.status}>
          감지된 포즈 수: {lastDetections.length}
        </Text>
        <Text style={styles.status}>
          뒤척임 감지: {isTurnText} (movement={movementText}, turns={turnsText})
        </Text>
        {errorMessage && (
          <Text style={[styles.status, { color: "#fca5a5" }]}>
            에러: {errorMessage}
          </Text>
        )}
      </View>
    </View>
  );
}

// ──────────────────────────────────────
// 스타일
// ──────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  infoText: {
    color: "#fff",
    fontSize: 16,
  },
  overlay: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 32,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  status: {
    color: "#e5e7eb",
    fontSize: 12,
    marginVertical: 2,
  },
});
