// src/components/RoleSelection.tsx (React Native 버전)

import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Card } from "./ui/card";
import { Camera, User } from "lucide-react-native";

interface RoleSelectionProps {
  onRoleSelect: (role: "camera" | "user") => void;
}

export default function RoleSelection({ onRoleSelect }: RoleSelectionProps) {
  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        <View style={styles.header}>
          <Text style={styles.title}>역할 선택</Text>
          <Text style={styles.subtitle}>접속 유형을 선택해주세요</Text>
        </View>

        <View style={styles.grid}>
          {/* 카메라 역할 카드 */}
          <Pressable
            onPress={() => onRoleSelect("camera")}
            style={[styles.pressable, styles.pressableLeft]}
          >
            <Card style={[styles.card, styles.cardCamera]}>
              <View style={styles.cardContent}>
                <View style={[styles.iconCircle, styles.iconCircleCamera]}>
                  <Camera size={28} color="#A855F7" />
                </View>
                <View style={styles.cardTextWrapper}>
                  <Text style={styles.cardTitle}>카메라</Text>
                  <Text style={styles.cardDescription}>
                    모니터링 카메라로 접속합니다
                  </Text>
                </View>
              </View>
            </Card>
          </Pressable>

          {/* 사용자 역할 카드 */}
          <Pressable onPress={() => onRoleSelect("user")} style={styles.pressable}>
            <Card style={[styles.card, styles.cardUser]}>
              <View style={styles.cardContent}>
                <View style={[styles.iconCircle, styles.iconCircleUser]}>
                  <User size={28} color="#6366F1" />
                </View>
                <View style={styles.cardTextWrapper}>
                  <Text style={styles.cardTitle}>사용자</Text>
                  <Text style={styles.cardDescription}>
                    부모/보호자로 접속합니다
                  </Text>
                </View>
              </View>
            </Card>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4EEFF", // 그라디언트 대신 연보라 배경
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
  },
  inner: {
    width: "100%",
    maxWidth: 360,
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: "#6B7280",
  },
  grid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  pressable: {
    flex: 1,
  },
  // gap 대신 첫 번째 카드만 오른쪽 마진
  pressableLeft: {
    marginRight: 12,
  },
  card: {
    padding: 16,
    borderWidth: 2,
    borderRadius: 16,
  },
  cardCamera: {
    borderColor: "#E9D5FF",
  },
  cardUser: {
    borderColor: "#DDD6FE",
  },
  cardContent: {
    alignItems: "center",
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  iconCircleCamera: {
    backgroundColor: "#EDE9FE",
  },
  iconCircleUser: {
    backgroundColor: "#E0E7FF",
  },
  // 아이콘 색은 color prop으로 넘기니까 여기선 스타일 비워둠
  iconCamera: {},
  iconUser: {},
  cardTextWrapper: {
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 11,
    color: "#6B7280",
    textAlign: "center",
  },
});
