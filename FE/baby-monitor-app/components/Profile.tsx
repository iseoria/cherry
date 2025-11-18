// src/components/Profile.tsx (React Native 버전)

import React, { useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { User, Baby, ArrowLeft, Save } from "lucide-react-native";

interface ProfileProps {
  onBack: () => void;
  userInfo: { name: string; email: string; avatar: string };
  babyInfo?: { name: string; gender: "male" | "female" | ""; birthDate: string };
  onUpdateBabyInfo: (info: {
    name: string;
    gender: "male" | "female" | "";
    birthDate: string;
  }) => Promise<void> | void;
}

export default function Profile({
  onBack,
  userInfo,
  babyInfo,
  onUpdateBabyInfo,
}: ProfileProps) {
  const [babyName, setBabyName] = useState(babyInfo?.name || "");
  const [babyGender, setBabyGender] = useState<"male" | "female" | "">(
    babyInfo?.gender || ""
  );
  const [babyBirthDate, setBabyBirthDate] = useState(babyInfo?.birthDate || "");

  const handleSave = async () => {
    if (!babyName || !babyGender || !babyBirthDate) {
      Alert.alert("오류", "모든 정보를 입력해주세요");
      return;
    }

    try {
      await onUpdateBabyInfo({
        name: babyName,
        gender: babyGender,
        birthDate: babyBirthDate,
      });

      Alert.alert("완료", "프로필이 저장되었습니다");
      onBack();
    } catch (err: any) {
      console.error(err);
      Alert.alert(
        "오류",
        err?.message || "아기 정보 저장 중 오류가 발생했습니다."
      );
    }
  };

  const [year, month, day] = babyBirthDate.split("-");

  const handleYearChange = (text: string) => {
    const newDate = `${text}-${month || ""}-${day || ""}`;
    setBabyBirthDate(newDate);
  };

  const handleMonthChange = (text: string) => {
    const newDate = `${year || ""}-${text}-${day || ""}`;
    setBabyBirthDate(newDate);
  };

  const handleDayChange = (text: string) => {
    const newDate = `${year || ""}-${month || ""}-${text}`;
    setBabyBirthDate(newDate);
  };

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Button
          variant="ghost"
          size="sm"
          onPress={onBack}
          style={styles.backButton}
        >
          <ArrowLeft size={16} color="#111827" />
        </Button>
        <Text style={styles.headerTitle}>프로필</Text>
      </View>

      {/* 부모 프로필 */}
      <Card style={styles.card}>
        <View style={styles.sectionHeader}>
          <User size={20} style={styles.sectionIcon} color="#A855F7" />
          <Text style={styles.sectionTitle}>부모 정보</Text>
        </View>

        <View style={styles.parentInfoRow}>
          <View style={styles.parentAvatar}>
            <User size={28} style={styles.parentAvatarIcon} color="#A855F7" />
          </View>
          <View>
            <Text style={styles.parentName}>{userInfo.name}</Text>
            <Text style={styles.parentEmail}>{userInfo.email}</Text>
          </View>
        </View>
      </Card>

      {/* 아기 프로필 */}
      <Card style={styles.card}>
        <View style={styles.sectionHeader}>
          <Baby size={20} style={styles.sectionIcon} color="#A855F7" />
          <Text style={styles.sectionTitle}>아기 정보</Text>
        </View>

        <View style={styles.fieldGroup}>
          <View style={styles.field}>
            <Label style={styles.label}>아기 이름</Label>
            <Input
              placeholder="이름을 입력하세요"
              value={babyName}
              onChangeText={setBabyName}
              style={styles.input}
            />
          </View>

          <View style={styles.field}>
            <Label style={styles.label}>성별</Label>
            <Select
              value={babyGender}
              onValueChange={(value) => {
                if (value === "male" || value === "female") {
                  setBabyGender(value);
                }
              }}
            >
              <SelectTrigger style={styles.input}>
                <SelectValue placeholder="성별을 선택하세요" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="male">남아</SelectItem>
                <SelectItem value="female">여아</SelectItem>
              </SelectContent>
            </Select>
          </View>

          <View style={styles.field}>
            <Label style={styles.label}>생년월일</Label>
            <View style={styles.dateRow}>
              <Input
                placeholder="년 (YYYY)"
                value={year || ""}
                onChangeText={handleYearChange}
                keyboardType="numeric"
                style={[styles.input, styles.dateInput]}
              />
              <Input
                placeholder="월 (MM)"
                value={month || ""}
                onChangeText={handleMonthChange}
                keyboardType="numeric"
                style={[styles.input, styles.dateInput]}
              />
              <Input
                placeholder="일 (DD)"
                value={day || ""}
                onChangeText={handleDayChange}
                keyboardType="numeric"
                style={[styles.input, styles.dateInput]}
              />
            </View>
          </View>
        </View>
      </Card>

      {/* 저장 버튼 */}
      <Button onPress={handleSave} style={styles.saveButton}>
        <Save size={16} style={styles.saveIcon} color="#FFFFFF" />
        <Text style={styles.saveText}>저장</Text>
      </Button>

      {/* 아기 프로필 미리보기 (저장된 경우에만 표시) */}
      {babyInfo && babyInfo.name ? (
        <Card style={styles.previewCard}>
          <View style={styles.previewHeader}>
            <Baby size={20} style={styles.previewIcon} color="#A855F7" />
            <Text style={styles.previewTitle}>현재 프로필</Text>
          </View>

          <View style={styles.previewRow}>
            <View style={styles.previewAvatar}>
              <Baby size={24} style={styles.previewAvatarIcon} color="#8B5CF6" />
            </View>
            <View>
              <Text style={styles.previewName}>{babyInfo.name}</Text>
              <Text style={styles.previewMeta}>
                {babyInfo.gender === "male" ? "남아" : "여아"} ·{" "}
                {babyInfo.birthDate}
              </Text>
            </View>
          </View>
        </Card>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // gap은 RN에서 버전에 따라 타입 에러 날 수 있어서 일단 제거
    paddingVertical: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  backButton: {
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  card: {
    padding: 16,
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionIcon: {
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  parentInfoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  parentAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#F3E8FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  parentAvatarIcon: {
    // 색은 color prop으로 넘김
  },
  parentName: {
    marginBottom: 4,
    fontSize: 15,
  },
  parentEmail: {
    fontSize: 13,
    color: "#6B7280",
  },
  fieldGroup: {
    // gap 대신 각 field에 marginBottom 줌
  },
  field: {
    marginBottom: 8,
  },
  label: {
    fontSize: 13,
    marginBottom: 6,
  },
  input: {
    // 공통 인풋 여백 정도만 필요하면 여기서 추가
  },
  dateRow: {
    flexDirection: "row",
    marginTop: 4,
  },
  dateInput: {
    flex: 1,
    marginRight: 8,
  },
  saveButton: {
    marginTop: 8,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  saveIcon: {
    marginRight: 6,
  },
  saveText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "500",
  },
  previewCard: {
    marginTop: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E9D5FF",
  },
  previewHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  previewIcon: {
    marginRight: 8,
  },
  previewTitle: {
    fontSize: 14,
    color: "#7C3AED",
    fontWeight: "600",
  },
  previewRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  previewAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#F5D0FE",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  previewAvatarIcon: {
    // 색은 prop으로
  },
  previewName: {
    marginBottom: 2,
    fontSize: 15,
  },
  previewMeta: {
    fontSize: 13,
    color: "#7C3AED",
  },
});
