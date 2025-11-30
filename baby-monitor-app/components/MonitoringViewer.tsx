// src/screens/ParentMonitorScreen.tsx

import React, { useCallback, useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { io, Socket } from "socket.io-client";
import {
  MediaStream,
  RTCPeerConnection,
  RTCSessionDescription,
  RTCIceCandidate,
  RTCView,
} from "react-native-webrtc";

import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { ArrowLeft, Video } from "lucide-react-native";

interface ParentMonitorScreenProps {
  onBack: () => void;
}

// 시그널링 서버 주소 & 룸 ID (송출 쪽이랑 동일하게 맞추기)
const SIGNALING_SERVER_URL = "http://localhost:3000";
const ROOM_ID = "baby-room-1";

export default function ParentMonitorScreen({
  onBack,
}: ParentMonitorScreenProps) {
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [connectionState, setConnectionState] = useState<string>("new");
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const socketRef = useRef<Socket | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);

  // PeerConnection 생성 함수
  // PeerConnection 생성 함수
const createPeerConnection = useCallback(() => {
  // 타입 때문에 귀찮으니까 일단 any 로 깔끔하게
  const pc: any = new RTCPeerConnection({
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  });

  // 상대 ICE 후보 받기
  pc.onicecandidate = (event: any) => {
    if (event.candidate && socketRef.current) {
      socketRef.current.emit("ice-candidate", {
        roomId: ROOM_ID,
        from: "parent", // 시청자
        candidate: event.candidate,
      });
    }
  };

  // 송출 쪽 트랙이 들어오면 remoteStream 설정
  pc.ontrack = (event: any) => {
    const [stream] = event.streams;
    if (stream) {
      setRemoteStream(stream);
    }
  };

  // 연결 상태 변경 로그/상태 저장
  pc.onconnectionstatechange = () => {
    setConnectionState(pc.connectionState);
  };

  return pc;
}, []);

  // 소켓 & WebRTC 초기화
  useEffect(() => {
    setIsConnecting(true);
    setErrorMessage("");

    const socket = io(SIGNALING_SERVER_URL);
    socketRef.current = socket;

    socket.on("connect", () => {
      // 방 참여 (역할: parent)
      socket.emit("join-room", { roomId: ROOM_ID, role: "parent" });
    });

    // 송출 쪽에서 Offer 받으면 Answer 생성
    socket.on("offer", async (payload: any) => {
      try {
        const pc = createPeerConnection();
        pcRef.current = pc;

        const remoteDesc = new RTCSessionDescription(payload.offer);
        await pc.setRemoteDescription(remoteDesc);

        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        socket.emit("answer", {
          roomId: ROOM_ID,
          from: "parent",
          answer,
        });

        setIsConnecting(false);
      } catch (err: any) {
        console.error("Error handling offer:", err);
        setErrorMessage("영상 연결 중 오류가 발생했습니다.");
        setIsConnecting(false);
      }
    });

    // 송출 쪽 ICE 후보 받기
    socket.on("ice-candidate", async (payload: any) => {
      try {
        if (payload.from === "baby" && payload.candidate && pcRef.current) {
          const candidate = new RTCIceCandidate(payload.candidate);
          await pcRef.current.addIceCandidate(candidate);
        }
      } catch (err) {
        console.error("Error adding ICE candidate:", err);
      }
    });

    socket.on("connect_error", (err: any) => {
      console.error("Socket connect error:", err);
      setErrorMessage("시그널링 서버에 연결할 수 없습니다.");
      setIsConnecting(false);
    });

    // 정리
    return () => {
      socket.removeAllListeners();
      socket.disconnect();
      socketRef.current = null;

      if (pcRef.current) {
        pcRef.current.close();
        pcRef.current = null;
      }
      setRemoteStream(null);
    };
  }, [createPeerConnection]);

  const renderStatusText = () => {
    if (errorMessage) return errorMessage;

    if (isConnecting) return "송출 중인 카메라를 찾는 중입니다...";

    switch (connectionState) {
      case "new":
      case "connecting":
        return "연결 중입니다...";
      case "connected":
        return "연결되었습니다.";
      case "disconnected":
        return "연결이 일시적으로 끊어졌습니다.";
      case "failed":
        return "연결에 실패했습니다.";
      case "closed":
        return "연결이 종료되었습니다.";
      default:
        return "대기 중입니다.";
    }
  };

  return (
    <View style={styles.container}>
      {/* 상단 헤더 */}
      <View style={styles.header}>
        <Button variant="ghost" onPress={onBack} style={styles.backButton}>
          <ArrowLeft size={20} style={styles.backIcon} />
          <Text style={styles.backText}>뒤로가기</Text>
        </Button>
      </View>

      {/* 메인 카드 */}
      <Card style={styles.card}>
        <View style={styles.cardInner}>
          <View style={styles.titleRow}>
            <Video size={20} color="#a855f7" style={{ marginRight: 8 }} />
            <Text style={styles.title}>실시간 아기 모니터</Text>
          </View>
          <Text style={styles.subtitle}>
            아기 폰에서 카메라 모드를 시작하면 이 화면에 영상이 표시됩니다.
          </Text>

          <View style={styles.videoContainer}>
            {remoteStream ? (
              <RTCView
                streamURL={remoteStream.toURL()}
                style={styles.video}
                objectFit="cover"
              />
            ) : (
              <View style={styles.videoPlaceholder}>
                {isConnecting && <ActivityIndicator size="large" />}
                <Text style={styles.placeholderText}>{renderStatusText()}</Text>
                <Text style={styles.placeholderSubText}>
                  같은 방(ROOM_ID)을 사용하는 송출 기기에서 WebRTC 연결을
                  시작해야 합니다.
                </Text>
              </View>
            )}
          </View>

          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>연결 상태</Text>
            <Text style={styles.statusValue}>{connectionState}</Text>
          </View>
        </View>
      </Card>
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
  card: {
    flex: 1,
  },
  cardInner: {
    flex: 1,
    padding: 12,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#4b5563",
  },
  subtitle: {
    fontSize: 13,
    color: "#6b7280",
    marginBottom: 12,
  },
  videoContainer: {
    flex: 1,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#000000",
  },
  video: {
    flex: 1,
  },
  videoPlaceholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    backgroundColor: "#111827",
  },
  placeholderText: {
    marginTop: 8,
    color: "#ffffff",
    fontSize: 14,
    textAlign: "center",
  },
  placeholderSubText: {
    marginTop: 6,
    color: "#9ca3af",
    fontSize: 12,
    textAlign: "center",
  },
  statusRow: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statusLabel: {
    fontSize: 13,
    color: "#6b7280",
  },
  statusValue: {
    fontSize: 13,
    fontWeight: "600",
    color: "#4b5563",
  },
});
