// components/babyProfileWithApi.tsx (React Native 버전)
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import Profile from "./Profile"; // RN용 Profile 컴포넌트 만들어서 여기에 두고 import
import { UserInfo } from "../constants/types";

type Gender = "male" | "female" | "";

export interface BabyInfo {
  name: string;
  gender: Gender;
  birthDate: string; // "YYYY-MM-DD"
}

interface ProfileWithApiProps {
  userInfo: UserInfo;
}

interface ProfileWithApiProps {
  onBack: () => void;
  userInfo: UserInfo;

  babyInfo: BabyInfo;
  onUpdateBabyInfo: (info: BabyInfo) => void;
}

// Expo에서는 보통 EXPO_PUBLIC_* 환경변수 사용
const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ?? "http://localhost:3000";

export default function ProfileWithApi({
  onBack,
  userInfo,
  babyInfo,
  onUpdateBabyInfo,
}: ProfileWithApiProps) {
  const [localBabyInfo, setLocalBabyInfo] = useState<BabyInfo | undefined>(
    babyInfo && babyInfo.name ? babyInfo : undefined,
  );
  const [loading, setLoading] = useState<boolean>(!babyInfo.name);

  // 🔹 1) 처음 들어올 때 아기 정보 조회 (GET /baby?userId=...)
  useEffect(() => {
    // 이미 상위에서 babyInfo가 채워져 있으면 API 안 부름
    if (babyInfo && babyInfo.name) {
      setLoading(false);
      return;
    }

    const load = async () => {
      try {
        const url = `${API_BASE_URL}/baby?userId=${userInfo.id}`;
        console.log("[GET baby]", url);

        const res = await fetch(url, {
          credentials: "include",
        });

        if (res.status === 404) {
          setLocalBabyInfo(undefined);
          return;
        }

        if (!res.ok) {
          throw new Error("아기 정보 조회 실패");
        }

        const data = await res.json();

        // 백엔드 필드명 매핑 (babyname, babygender, baby_birthday 가정)
        const info: BabyInfo = {
          name: data.babyname ?? data.name,
          gender: data.babygender ?? data.gender,
          birthDate: data.baby_birthday ?? data.birthDate,
        };

        setLocalBabyInfo(info);
        onUpdateBabyInfo(info);
      } catch (err) {
        console.error(err);
        Alert.alert("오류", "아기 정보를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [userInfo.id]);

  // 🔹 2) Profile에서 "저장" 눌렀을 때 호출되는 함수
  const handleUpdateBabyInfo = async (info: BabyInfo) => {
    try {
      const url = `${API_BASE_URL}/babyfix`; // server.js 의 app.use("/babyfix"... )와 맞춤
      console.log("[PUT babyfix]", url, {
        userId: userInfo.id,
        babyname: info.name,
        babygender: info.gender,
        baby_birthday: info.birthDate,
      });

      const res = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          userId: userInfo.id,
          babyname: info.name,
          babygender: info.gender,
          baby_birthday: info.birthDate,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(
          body.error || "아기 정보 저장 중 오류가 발생했습니다.",
        );
      }

      setLocalBabyInfo(info);
      onUpdateBabyInfo(info);
      Alert.alert("완료", "아기 정보가 저장되었습니다.");
    } catch (err: any) {
      console.error(err);
      Alert.alert("오류", err.message ?? "저장 중 오류가 발생했습니다.");
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#7c3aed" />
        <Text style={styles.loadingText}>아기 정보를 불러오는 중...</Text>
      </View>
    );
  }

  return (
    <Profile
      onBack={onBack}
      userInfo={userInfo}
      babyInfo={localBabyInfo ?? babyInfo}
      onUpdateBabyInfo={handleUpdateBabyInfo}
    />
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  loadingText: {
    marginTop: 8,
    fontSize: 12,
    color: "#6b7280",
  },
});
