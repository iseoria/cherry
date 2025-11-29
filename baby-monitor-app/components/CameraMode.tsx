/*기존 UI는 그대로 유지

안에 handleFrame 이라는 함수 추가

그 안에서

runYoloOnFrame(YOLO 추론 · 지금은 스텁)

parseKeypointsFromYolo

detectMotionFromKeypoints

fetch로 서버에 이벤트 전송

까지 프레임 단위 흐름을 다 적어 둔 버전
--------
// TODO: 카메라/WebRTC 프레임 나오면 여기로 연결
// 예: onFrame={(frame) => handleFrame({ data: ..., width: ..., height: ... })}
*/

import React, { useCallback, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Camera, ArrowLeft } from "lucide-react-native";

// YOLO + 뒤척임 감지 관련 import
import { runYoloOnFrame, FrameLike } from "../lib/ai/yoloSession";
import {
  detectMotionFromKeypoints,
  Keypoint,
} from "../lib/ai/motionDetection";

interface CameraModeProps {
  onBack: () => void;
}

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL || "http://10.0.2.2:3000";

export default function CameraMode({ onBack }: CameraModeProps) {
  const [turns, setTurns] = useState(0);
  const [lastMovement, setLastMovement] = useState(0);

  // 🔵 프레임 하나 들어올 때마다 호출할 함수
  const handleFrame = useCallback(
    async (frame: FrameLike) => {
      try {
        // 1) YOLO ONNX 추론
        const yoloOutput = await runYoloOnFrame(frame);

        // 2) YOLO 결과에서 keypoints 파싱
        const keypoints = parseKeypointsFromYolo(yoloOutput);

        // 3) 뒤척임 감지
        const motion = detectMotionFromKeypoints(keypoints);

        setTurns(motion.turns);
        setLastMovement(motion.movement);

        // 4) 뒤척임 이벤트 발생 시 서버에 POST
        if (motion.isTurn) {
          await fetch(`${API_BASE_URL}/api/motion`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              turnCount: motion.turns,
              movement: motion.movement,
              timestamp: new Date().toISOString(),
              // roomId, babyId 등 필요하면 여기 추가
            }),
          });
        }
      } catch (err) {
        console.warn("YOLO / motion detection error", err);
      }
    },
    [setTurns, setLastMovement]
  );

  // 나중에 실제 카메라/WebRTC 코드에서:
  // onFrame={(frame) =>
  //   handleFrame({ data: frame.data, width: frame.width, height: frame.height })
  // }

  return (
    <View style={styles.container}>
      {/* 상단 뒤로가기 영역 */}
      <View style={styles.header}>
        <Button variant="ghost" onPress={onBack} style={styles.backButton}>
          <ArrowLeft size={20} style={styles.backIcon} />
          <Text style={styles.backText}>뒤로가기</Text>
        </Button>
      </View>

      {/* 가운데 카드 영역 */}
      <View style={styles.center}>
        <Card style={styles.card}>
          <View style={styles.cardInner}>
            <View style={styles.iconWrapper}>
              <Camera size={48} />
            </View>
            <Text style={styles.title}>카메라 모드</Text>
            <Text style={styles.description}>
              카메라 기능은 현재 개발 중입니다.
            </Text>

            {/* 디버그용 상태 (원하면 삭제해도 됨) */}
            <View style={{ marginTop: 16 }}>
              <Text style={{ fontSize: 12, color: "#6B7280" }}>
                뒤척임 횟수(turns): {turns}
              </Text>
              <Text style={{ fontSize: 12, color: "#6B7280" }}>
                최근 movement: {lastMovement.toFixed(2)}
              </Text>
            </View>
          </View>
        </Card>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F4EEFF",
  },
  header: {
    marginBottom: 16,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
  },
  backIcon: {
    marginRight: 8,
  },
  backText: {
    fontSize: 14,
  },
  center: {
    flex: 1,
    justifyContent: "center",
  },
  card: {
    alignSelf: "stretch",
  },
  cardInner: {
    alignItems: "center",
  },
  iconWrapper: {
    width: 96,
    height: 96,
    borderRadius: 48,
    marginBottom: 24,
    backgroundColor: "#EDE7FF",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },
});

/**
 * YOLO 출력 → Keypoint[] 변환
 * - 실제 ONNX 모델 output key 이름/shape에 맞게 수정해야 하는 부분
 */
function parseKeypointsFromYolo(yoloOutput: any): Keypoint[] {
  // TODO: 모델 구조에 맞게 구현
  if (!yoloOutput || !Array.isArray(yoloOutput.keypoints)) {
    return [];
  }
  return yoloOutput.keypoints as Keypoint[];
}
