// app/index.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";

import Login from "../components/Login";
import RoleSelection from "../components/RoleSelection";
import CameraMode from "../components/CameraMode";
import LiveMonitoring from "../components/LiveMonitoring";

import ProfileWithApi from "../components/babyProfileWithApi";
import Calendar from "../components/Calendar";
import Reports from "../components/Reports";
import Settings from "../components/Settings";

import { UserInfo } from "../constants/types";

// ===== 타입 정의 =====

interface SleepRecord {
  id: string;
  date: Date;
  startTime: Date;
  endTime: Date;
  duration: number;
  events: Array<{ type: string; severity: "low" | "medium" | "high"; time: Date }>;
  aiScore: number;
  quality: "excellent" | "good" | "fair" | "poor";
  tossingCount: number;
  cryingEvents: number;
}

interface Event {
  id: string;
  type: string;
  severity: "low" | "medium" | "high";
  timestamp: Date;
  description: string;
  aiConfidence: number;
  resolved: boolean;
  memo?: string;
}

interface DayRecord {
  date: string;
  events: Array<{ type: string; time: string; severity: "low" | "medium" | "high" }>;
  sleepTime: number;
  napTime: number;
  sleepQuality: "excellent" | "good" | "fair" | "poor";
  tossingCount: number;
  cryingCount: number;
  fallCount: number;
  memo: string;
}

interface BabyInfo {
  name: string;
  gender: "male" | "female" | "";
  birthDate: string;
}

// 간단 토스트 대체 (웹 sonner → RN Alert)
const showToast = {
  success: (msg: string) => Alert.alert("알림", msg),
  error: (msg: string) => Alert.alert("오류", msg),
  info: (msg: string) => Alert.alert("정보", msg),
  warning: (msg: string) => Alert.alert("주의", msg),
};

// ✅ 이 컴포넌트가 App.tsx에서 불러올 "루트 화면"
export default function AppRoot() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedRole, setSelectedRole] = useState<"camera" | "user" | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [babyInfo, setBabyInfo] = useState<BabyInfo>({
    name: "",
    gender: "",
    birthDate: "",
  });

  const [sleepRecords, setSleepRecords] = useState<SleepRecord[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [dayRecords, setDayRecords] = useState<DayRecord[]>([]);

  const [activeTab, setActiveTab] = useState<"home" | "calendar" | "reports" | "settings">(
    "home",
  );
  const [showCameraMode, setShowCameraMode] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // ===== 샘플 데이터 세팅 (로그인 + user일 때만) =====
  useEffect(() => {
    if (isLoggedIn && selectedRole === "user") {
      const sampleEvents: Event[] = [
        {
          id: "1",
          type: "뒤척임",
          severity: "low",
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
          description: "정상적인 수면 중 자세 변화가 감지되었습니다.",
          aiConfidence: 85,
          resolved: false,
        },
        {
          id: "2",
          type: "울음소리",
          severity: "medium",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          description: "70dB 이상의 소음이 감지되었습니다.",
          aiConfidence: 92,
          resolved: true,
        },
        {
          id: "3",
          type: "얼굴 가림",
          severity: "high",
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
          description: "베개로 인한 얼굴 가림 현상이 감지되었습니다.",
          aiConfidence: 96,
          resolved: true,
        },
      ];

      const sampleData: SleepRecord[] = [
        {
          id: "1",
          date: new Date(),
          startTime: new Date(Date.now() - 4 * 60 * 60 * 1000),
          endTime: new Date(Date.now() - 1 * 60 * 60 * 1000),
          duration: 3 * 60 * 60,
          events: [
            {
              type: "뒤척임",
              severity: "low",
              time: new Date(Date.now() - 2 * 60 * 60 * 1000),
            },
            {
              type: "울음소리",
              severity: "medium",
              time: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
            },
          ],
          aiScore: 85,
          quality: "good",
          tossingCount: 8,
          cryingEvents: 2,
        },
        {
          id: "2",
          date: new Date(Date.now() - 24 * 60 * 60 * 1000),
          startTime: new Date(Date.now() - 24 * 60 * 60 * 1000 - 2 * 60 * 60 * 1000),
          endTime: new Date(Date.now() - 24 * 60 * 60 * 1000),
          duration: 2 * 60 * 60,
          events: [
            {
              type: "얼굴 가림",
              severity: "high",
              time: new Date(
                Date.now() - 24 * 60 * 60 * 1000 - 1 * 60 * 60 * 1000,
              ),
            },
          ],
          aiScore: 65,
          quality: "fair",
          tossingCount: 12,
          cryingEvents: 1,
        },
        {
          id: "3",
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          startTime: new Date(
            Date.now() - 2 * 24 * 60 * 60 * 1000 - 3 * 60 * 60 * 1000,
          ),
          endTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          duration: 3 * 60 * 60,
          events: [],
          aiScore: 95,
          quality: "excellent",
          tossingCount: 3,
          cryingEvents: 0,
        },
      ];

      const sampleDayRecords: DayRecord[] = [
        {
          date: new Date().toISOString().split("T")[0],
          events: [
            { type: "뒤척임", time: "14:30", severity: "low" },
            { type: "울음소리", time: "15:45", severity: "medium" },
          ],
          sleepTime: 480,
          napTime: 90,
          sleepQuality: "good",
          tossingCount: 8,
          cryingCount: 2,
          fallCount: 0,
          memo:
            "오늘은 비교적 잘 잤어요. 오후에 약간의 소음이 있었지만 큰 문제는 없었습니다.",
        },
        {
          date: new Date(Date.now() - 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
          events: [
            { type: "얼굴 가림", time: "16:20", severity: "high" },
            { type: "낙상 감지", time: "17:15", severity: "high" },
          ],
          sleepTime: 420,
          napTime: 60,
          sleepQuality: "fair",
          tossingCount: 12,
          cryingCount: 1,
          fallCount: 1,
          memo: "",
        },
        {
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
          events: [],
          sleepTime: 540,
          napTime: 120,
          sleepQuality: "excellent",
          tossingCount: 3,
          cryingCount: 0,
          fallCount: 0,
          memo: "매우 편안한 하루였습니다.",
        },
      ];

      setSleepRecords(sampleData);
      setEvents(sampleEvents);
      setDayRecords(sampleDayRecords);
    }
  }, [isLoggedIn, selectedRole]);

  // ===== 핸들러들 =====

  const handleLogin = (info: UserInfo) => {
    setUserInfo(info);
    setIsLoggedIn(true);
    showToast.success(`${info.name}님, 환영합니다!`);
  };

  const handleRoleSelect = (role: "camera" | "user") => setSelectedRole(role);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setSelectedRole(null);
    setUserInfo(null);
    setBabyInfo({ name: "", gender: "", birthDate: "" });
    setSleepRecords([]);
    setEvents([]);
    setDayRecords([]);
    setActiveTab("home");
    setShowCameraMode(false);
    setShowProfile(false);
    showToast.success("로그아웃되었습니다");
  };

  const handleUpdateBabyInfo = (info: BabyInfo) => setBabyInfo(info);

  const handleEventDetected = (
    eventType: string,
    severity: "low" | "medium" | "high",
  ) => {
    const newEvent: Event = {
      id: Date.now().toString(),
      type: eventType,
      severity,
      timestamp: new Date(),
      description: `${eventType}이(가) 감지되었습니다. ${
        severity === "high"
          ? "즉시 확인이 필요합니다."
          : "정상 범위 내의 활동입니다."
      }`,
      aiConfidence: Math.floor(Math.random() * 20) + 80,
      resolved: false,
    };

    setEvents((prev) => [newEvent, ...prev]);

    const today = new Date().toISOString().split("T")[0];
    setDayRecords((prev) => {
      const existing = prev.find((r) => r.date === today);
      const hhmm = new Date().toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
      });

      if (existing) {
        return prev.map((r) => {
          if (r.date !== today) return r;
          const next: DayRecord = {
            ...r,
            events: [...r.events, { type: eventType, time: hhmm, severity }],
          };
          if (eventType === "뒤척임") next.tossingCount += 1;
          else if (eventType === "울음소리") next.cryingCount += 1;
          else if (eventType === "낙상 감지") next.fallCount += 1;
          return next;
        });
      }

      return [
        ...prev,
        {
          date: today,
          events: [{ type: eventType, time: hhmm, severity }],
          sleepTime: 0,
          napTime: 0,
          sleepQuality: "good",
          tossingCount: eventType === "뒤척임" ? 1 : 0,
          cryingCount: eventType === "울음소리" ? 1 : 0,
          fallCount: eventType === "낙상 감지" ? 1 : 0,
          memo: "",
        },
      ];
    });

    if (severity === "high") showToast.error(`⚠️ ${eventType} 감지! 즉시 확인하세요.`);
    else if (severity === "medium") showToast.warning(`📢 ${eventType} 감지`);
    else showToast.info(`ℹ️ ${eventType} 감지`);
  };

  const handleUpdateEventMemo = (eventId: string, memo: string) => {
    setEvents((prev) => prev.map((e) => (e.id === eventId ? { ...e, memo } : e)));
    showToast.success("메모가 저장되었습니다");
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== eventId));
    showToast.success("알림이 삭제되었습니다");
  };

  const handleUpdateDayMemo = (date: string, memo: string) => {
    setDayRecords((prev) => {
      const existing = prev.find((r) => r.date === date);
      if (existing) {
        return prev.map((r) => (r.date === date ? { ...r, memo } : r));
      }
      return [
        ...prev,
        {
          date,
          events: [],
          sleepTime: 0,
          napTime: 0,
          sleepQuality: "good",
          tossingCount: 0,
          cryingCount: 0,
          fallCount: 0,
          memo,
        },
      ];
    });
    showToast.success("메모가 저장되었습니다");
  };

  const handleUpdateDayRecord = (date: string, updated: Partial<DayRecord>) => {
    setDayRecords((prev) => {
      const existing = prev.find((r) => r.date === date);
      if (existing) {
        return prev.map((r) => (r.date === date ? { ...r, ...updated } : r));
      }
      return [
        ...prev,
        {
          date,
          events: [],
          sleepTime: 0,
          napTime: 0,
          sleepQuality: "good",
          tossingCount: 0,
          cryingCount: 0,
          fallCount: 0,
          memo: "",
          ...updated,
        },
      ];
    });
    showToast.success("수면 기록이 저장되었습니다");
  };

  const handleClearData = () => {
    setSleepRecords([]);
    setEvents([]);
    setDayRecords([]);
    showToast.success("모든 데이터가 삭제되었습니다");
  };

  // ===== AI 인사이트 생성 =====

  const generateAIInsights = () => {
    if (dayRecords.length === 0) return [];

    const avgToss =
      dayRecords.reduce((s, r) => s + r.tossingCount, 0) / dayRecords.length;
    const avgSleepHours =
      dayRecords.reduce((s, r) => s + (r.sleepTime + r.napTime), 0) /
      dayRecords.length /
      60;
    const totalCry = dayRecords.reduce((s, r) => s + r.cryingCount, 0);
    const totalFall = dayRecords.reduce((s, r) => s + r.fallCount, 0);

    const insights: Array<{
      type: "warning" | "danger" | "good" | "info";
      title: string;
      description: string;
    }> = [];

    if (avgToss > 15)
      insights.push({
        type: "warning",
        title: "뒤척임 빈도 높음",
        description: `평균 ${Math.round(
          avgToss,
        )}회의 뒤척임이 감지되었습니다. 수면 환경이나 침구류 점검을 권장합니다.`,
      });
    else if (avgToss < 5)
      insights.push({
        type: "good",
        title: "안정적인 수면",
        description: "뒤척임이 적어 깊고 안정적인 수면을 취하고 있습니다.",
      });

    if (avgSleepHours < 6)
      insights.push({
        type: "warning",
        title: "수면 시간 부족",
        description: `평균 ${
          Math.round(avgSleepHours * 10) / 10
        }시간으로 권장 수면 시간보다 부족합니다.`,
      });
    else if (avgSleepHours > 12)
      insights.push({
        type: "info",
        title: "충분한 수면",
        description: "충분한 수면 시간을 유지하고 있습니다.",
      });

    if (totalCry > 10)
      insights.push({
        type: "warning",
        title: "울음 빈도 증가",
        description:
          "울음이나 불편함을 나타내는 신호가 자주 감지되었습니다. 환경 점검이 필요할 수 있습니다.",
      });

    if (totalFall > 3)
      insights.push({
        type: "danger",
        title: "낙상 위험 감지",
        description: `${totalFall}건의 낙상 이벤트가 감지되었습니다. 침대 안전장치를 점검하세요.`,
      });
    else if (totalFall === 0)
      insights.push({
        type: "good",
        title: "안전한 수면 환경",
        description: "낙상이나 위험한 상황이 감지되지 않았습니다.",
      });

    return insights;
  };

  const aiInsights = generateAIInsights();

  // ===== 로그인 / 역할 선택 / 카메라 모드 분기 =====

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  if (!selectedRole) {
    return <RoleSelection onRoleSelect={handleRoleSelect} />;
  }

  if (selectedRole === "camera" || showCameraMode) {
    return (
      <CameraMode
        onBack={() => {
          setSelectedRole(null);
          setShowCameraMode(false);
        }}
      />
    );
  }

  // ===== 메인 탭 화면 =====

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {showProfile ? (
          userInfo && (
            <ProfileWithApi
              onBack={() => setShowProfile(false)}
              userInfo={userInfo}
              babyInfo={babyInfo}
              onUpdateBabyInfo={handleUpdateBabyInfo}
            />
          )
        ) : (
          <View style={styles.tabContent}>
            {activeTab === "home" && (
              <LiveMonitoring
                onEventDetected={handleEventDetected}
                events={events}
                onUpdateEventMemo={handleUpdateEventMemo}
                onDeleteEvent={handleDeleteEvent}
                aiInsightsComponent={
                  aiInsights.length > 0 ? (
                    <View style={styles.aiCard}>
                      <Text style={styles.aiTitle}>🧠 AI 수면 분석 리포트</Text>
                      {aiInsights.map((insight, i) => (
                        <View
                          key={i}
                          style={[
                            styles.insightItem,
                            insight.type === "warning" && styles.insightWarning,
                            insight.type === "danger" && styles.insightDanger,
                            insight.type === "good" && styles.insightGood,
                            insight.type === "info" && styles.insightInfo,
                          ]}
                        >
                          <Text
                            style={[
                              styles.insightTitle,
                              insight.type === "warning" &&
                                styles.insightTitleWarning,
                              insight.type === "danger" &&
                                styles.insightTitleDanger,
                              insight.type === "good" && styles.insightTitleGood,
                              insight.type === "info" && styles.insightTitleInfo,
                            ]}
                          >
                            {insight.type === "danger" ? "⚠️ " : ""}
                            {insight.title}
                          </Text>
                          <Text style={styles.insightDescription}>
                            {insight.description}
                          </Text>
                        </View>
                      ))}
                    </View>
                  ) : null
                }
                onOpenMonitoring={() => setShowCameraMode(true)}
              />
            )}

            {activeTab === "calendar" && (
              <Calendar
                dayRecords={dayRecords}
                onUpdateDayMemo={handleUpdateDayMemo}
                onUpdateDayRecord={handleUpdateDayRecord}
              />
            )}

            {activeTab === "reports" && <Reports dayRecords={dayRecords} />}

            {activeTab === "settings" && (
              <Settings
                onClearData={handleClearData}
                onLogout={handleLogout}
                userInfo={userInfo!}
                onOpenProfile={() => setShowProfile(true)}
                babyInfo={babyInfo}
              />
            )}
          </View>
        )}
      </ScrollView>

      {!showProfile && (
        <View style={styles.tabBar}>
          <TabButton
            label="홈"
            active={activeTab === "home"}
            onPress={() => setActiveTab("home")}
          />
          <TabButton
            label="캘린더"
            active={activeTab === "calendar"}
            onPress={() => setActiveTab("calendar")}
          />
          <TabButton
            label="리포트"
            active={activeTab === "reports"}
            onPress={() => setActiveTab("reports")}
          />
          <TabButton
            label="설정"
            active={activeTab === "settings"}
            onPress={() => setActiveTab("settings")}
          />
        </View>
      )}
    </View>
  );
}

// ===== 탭 버튼 컴포넌트 =====

interface TabButtonProps {
  label: string;
  active: boolean;
  onPress: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({ label, active, onPress }) => {
  return (
    <TouchableOpacity
      style={[styles.tabButton, active && styles.tabButtonActive]}
      onPress={onPress}
    >
      <Text style={[styles.tabButtonLabel, active && styles.tabButtonLabelActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

// ===== 스타일 =====

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#f5f0ff",
  },
  scrollContent: {
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 80, // 탭바 공간
  },
  tabContent: {
    flex: 1,
  },
  aiCard: {
    marginTop: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#f3e8ff",
    borderWidth: 1,
    borderColor: "#e9d5ff",
  },
  aiTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#6b21a8",
  },
  insightItem: {
    padding: 8,
    borderRadius: 8,
    marginBottom: 6,
    borderLeftWidth: 4,
  },
  insightWarning: {
    backgroundColor: "#fef9c3",
    borderLeftColor: "#facc15",
  },
  insightDanger: {
    backgroundColor: "#fee2e2",
    borderLeftColor: "#f97373",
  },
  insightGood: {
    backgroundColor: "#dcfce7",
    borderLeftColor: "#22c55e",
  },
  insightInfo: {
    backgroundColor: "#dbeafe",
    borderLeftColor: "#3b82f6",
  },
  insightTitle: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 2,
  },
  insightTitleWarning: {
    color: "#854d0e",
  },
  insightTitleDanger: {
    color: "#b91c1c",
  },
  insightTitleGood: {
    color: "#166534",
  },
  insightTitleInfo: {
    color: "#1d4ed8",
  },
  insightDescription: {
    fontSize: 11,
    color: "#374151",
  },
  tabBar: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    backgroundColor: "rgba(255,255,255,0.95)",
    paddingBottom: 12,
    paddingTop: 8,
    paddingHorizontal: 12,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 6,
    borderRadius: 999,
  },
  tabButtonActive: {
    backgroundColor: "#ede9fe",
  },
  tabButtonLabel: {
    fontSize: 12,
    color: "#6b7280",
  },
  tabButtonLabelActive: {
    color: "#7c3aed",
    fontWeight: "600",
  },
});
