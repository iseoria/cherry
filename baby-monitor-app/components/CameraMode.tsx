// src/components/CameraMode.tsx

import React, { useCallback, useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { ArrowLeft, Camera as CameraIcon } from "lucide-react-native";
import { Card } from "./ui/card";
import { Button } from "./ui/button";

import io, { Socket } from "socket.io-client";
import {
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  mediaDevices,
  MediaStream,
  RTCView,
} from "react-native-webrtc";

interface CameraModeProps {
  onBack: () => void;
}

// ──────────────────────────────────────
// 설정 값
// ──────────────────────────────────────
const SIGNALING_URL = "http://localhost:3000"; // 시그널링 서버
const ROOM_ID = "baby-room"; // 예시 방 아이디 (부모폰과 동일하게 맞추면 됨)

export default function CameraMode({ onBack }: CameraModeProps) {
  const [hasPermission, setHasPermission] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const socketRef = useRef<Socket | null>(null);

  // ──────────────────────────────────────
  // 1) 카메라 / 마이크 권한 요청
  // ──────────────────────────────────────
  useEffect(() => {
    const requestPermission = async () => {
      try {
        // getUserMedia 호출 시 자동으로 권한 요청 (안드로이드 권한 설정은 native 쪽에 선언돼 있어야 함)
        const stream = await mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        setHasPermission(true);
        setLocalStream(stream);
      } catch (e) {
        console.warn("getUserMedia 실패:", e);
        setHasPermission(false);
      }
    };

    requestPermission();

    return () => {
      // 화면 나갈 때 스트림 정리
      if (localStream) {
        localStream.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  // ──────────────────────────────────────
  // 2) 시그널링 서버 연결
  // ──────────────────────────────────────
  useEffect(() => {
    const socket = io(SIGNALING_URL);
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("socket connected:", socket.id);
      socket.emit("join", { roomId: ROOM_ID, role: "baby" });
    });

    // 부모폰에서 보내는 answer 처리
    socket.on("answer", async (data: any) => {
      try {
        const pc = pcRef.current;
        if (!pc) return;

        console.log("answer 수신:", data);
        await pc.setRemoteDescription(
          new RTCSessionDescription(data.answer)
        );
      } catch (err) {
        console.error("answer 처리 실패:", err);
      }
    });

    // 부모폰에서 보내는 ICE 후보 처리
    socket.on("ice-candidate", async (data: any) => {
      try {
        const pc = pcRef.current;
        if (!pc) return;
        if (data.from === "parent" && data.candidate) {
          await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
        }
      } catch (err) {
        console.error("ice-candidate 처리 실패:", err);
      }
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  // ──────────────────────────────────────
  // 3) RTCPeerConnection 생성 함수
  // ──────────────────────────────────────
const createPeerConnection = useCallback(() => {
  // 👉 타입을 any로 선언해서 onicecandidate, onconnectionstatechange 오류 제거
  const pc: any = new RTCPeerConnection({
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  });

  // ICE 후보 생기면 서버로 전송
  pc.onicecandidate = (event: any) => {
    if (event.candidate && socketRef.current) {
      socketRef.current.emit("ice-candidate", {
        roomId: ROOM_ID,
        candidate: event.candidate,
        from: "baby",
      });
    }
  };

  // (선택) 연결 상태 로그
  pc.onconnectionstatechange = () => {
    console.log("pc state:", pc.connectionState);
  };

  return pc;
}, []);
  // ──────────────────────────────────────
  // 4) 송출 시작
  // ──────────────────────────────────────
  const startStreaming = useCallback(async () => {
    try {
      if (!localStream) {
        console.warn("localStream 이 없음");
        return;
      }
      if (!socketRef.current) {
        console.warn("socket 이 연결되지 않음");
        return;
      }

      const pc = createPeerConnection();
      pcRef.current = pc;

      // 로컬 트랙 추가
      localStream.getTracks().forEach((track) => {
        pc.addTrack(track, localStream);
      });

      // Offer 생성 & 서버에 전송
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      socketRef.current.emit("offer", {
        roomId: ROOM_ID,
        from: "baby",
        offer,
      });

      setIsStreaming(true);
    } catch (err) {
      console.error("startStreaming 실패:", err);
    }
  }, [createPeerConnection, localStream]);

  // ──────────────────────────────────────
  // 5) 송출 중지
  // ──────────────────────────────────────
  const stopStreaming = useCallback(() => {
    setIsStreaming(false);

    if (pcRef.current) {
      pcRef.current.getSenders().forEach((s) => s.track && s.track.stop());
      pcRef.current.close();
      pcRef.current = null;
    }
  }, []);

  // ──────────────────────────────────────
  // 렌더링
  // ──────────────────────────────────────
  return (
    <View style={styles.container}>
      {/* 상단 뒤로가기 */}
      <View style={styles.header}>
        <Button variant="ghost" onPress={onBack} style={styles.backButton}>
          <ArrowLeft size={20} style={styles.backIcon} />
          <Text style={styles.backText}>뒤로가기</Text>
        </Button>
      </View>

      {/* 가운데 카드 + 카메라 미리보기 */}
      <View style={styles.center}>
        <Card style={styles.card}>
          <View style={styles.cardInner}>
            <View style={styles.iconWrapper}>
              <CameraIcon size={40} />
            </View>

            <Text style={styles.title}>카메라 송출 모드</Text>

            {!hasPermission && (
              <Text style={styles.description}>
                카메라/마이크 권한이 필요합니다. 설정에서 허용해 주세요.
              </Text>
            )}

            {hasPermission && !localStream && (
              <Text style={styles.description}>
                카메라 스트림을 준비 중입니다...
              </Text>
            )}

            {hasPermission && localStream && (
              <>
                <View style={styles.previewWrapper}>
                  <RTCView
                    streamURL={localStream.toURL()}
                    style={styles.rtcView}
                    objectFit="cover"
                  />
                </View>

                <Text style={styles.description}>
                  이 화면이 부모폰으로 WebRTC(P2P)로 전송됩니다.
                </Text>

                <View style={styles.buttonRow}>
                  {!isStreaming ? (
                    <Button onPress={startStreaming}>
                      <Text style={styles.buttonText}>송출 시작</Text>
                    </Button>
                  ) : (
                    <Button variant="outline" onPress={stopStreaming}>
                      <Text style={styles.buttonText}>송출 중지</Text>
                    </Button>
                  )}
                </View>
              </>
            )}
          </View>
        </Card>
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
    paddingVertical: 16,
  },
  iconWrapper: {
    width: 72,
    height: 72,
    borderRadius: 36,
    marginBottom: 16,
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
    marginTop: 4,
  },
  previewWrapper: {
    width: "100%",
    aspectRatio: 9 / 16,
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 16,
    backgroundColor: "#000",
  },
  rtcView: {
    flex: 1,
  },
  buttonRow: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "center",
  },
  buttonText: {
    color: "#111827",
    fontSize: 14,
    fontWeight: "500",
  },
});
