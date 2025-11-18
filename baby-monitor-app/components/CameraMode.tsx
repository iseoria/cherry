// src/components/CameraMode.tsx (React Native 버전)

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Camera, ArrowLeft } from "lucide-react-native";

interface CameraModeProps {
  onBack: () => void;
}

export default function CameraMode({ onBack }: CameraModeProps) {
  return (
    <View style={styles.container}>
      {/* 상단 뒤로가기 영역 */}
      <View style={styles.header}>
        <Button
          variant="ghost"
          onPress={onBack}
          style={styles.backButton}
        >
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
    // 웹에서 bg-gradient-to-br from-white via-purple-50 to-violet-100 대충 대응
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
