// components/Calendar.tsx (React Native 버전)
import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Modal,
} from "react-native";

interface DayRecord {
  date: string;
  events: Array<{ type: string; time: string; severity: "low" | "medium" | "high" }>;
  sleepTime: number; // 분 단위
  napTime: number; // 분 단위
  sleepQuality: "excellent" | "good" | "fair" | "poor";
  tossingCount: number;
  cryingCount: number;
  fallCount: number;
  memo: string;
}

interface CalendarProps {
  dayRecords: DayRecord[];
  onUpdateDayMemo: (date: string, memo: string) => void;
  onUpdateDayRecord: (date: string, updatedData: Partial<DayRecord>) => void;
}

export default function Calendar({
  dayRecords,
  onUpdateDayMemo,
  onUpdateDayRecord,
}: CalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [memoText, setMemoText] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [showVideoDialog, setShowVideoDialog] = useState(false);
  const [selectedVideoEvent, setSelectedVideoEvent] = useState<{
    type: string;
    time: string;
  } | null>(null);

  // 수동 입력 필드 상태
  const [manualEntry, setManualEntry] = useState({
    sleepTime: 0,
    napTime: 0,
    tossingCount: 0,
    cryingCount: 0,
    fallCount: 0,
    sleepQuality: "good" as "excellent" | "good" | "fair" | "poor",
  });

  const selectedDateString = selectedDate
    ? selectedDate.toISOString().split("T")[0]
    : undefined;

  const selectedDayRecord = useMemo(
    () => dayRecords.find((record) => record.date === selectedDateString),
    [dayRecords, selectedDateString],
  );

  // 초기 로드 시 오늘 날짜 데이터 표시
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const todayRecord = dayRecords.find((r) => r.date === today);
    setMemoText(todayRecord?.memo || "");
    if (todayRecord) {
      setManualEntry({
        sleepTime: todayRecord.sleepTime,
        napTime: todayRecord.napTime,
        tossingCount: todayRecord.tossingCount,
        cryingCount: todayRecord.cryingCount,
        fallCount: todayRecord.fallCount,
        sleepQuality: todayRecord.sleepQuality,
      });
    }
  }, []);

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}분`;
    return `${hours}시간 ${mins > 0 ? `${mins}분` : ""}`;
  };

  const getQualityColor = (quality: "excellent" | "good" | "fair" | "poor") => {
    switch (quality) {
      case "excellent":
        return { bg: "#dcfce7", text: "#166534" }; // green
      case "good":
        return { bg: "#f3e8ff", text: "#7c3aed" }; // purple
      case "fair":
        return { bg: "#fef9c3", text: "#854d0e" }; // yellow
      case "poor":
        return { bg: "#fee2e2", text: "#b91c1c" }; // red
    }
  };

  const getQualityText = (quality: "excellent" | "good" | "fair" | "poor") => {
    switch (quality) {
      case "excellent":
        return "우수";
      case "good":
        return "좋음";
      case "fair":
        return "보통";
      case "poor":
        return "나쁨";
    }
  };

  const getSeverityColor = (severity: "low" | "medium" | "high") => {
    switch (severity) {
      case "low":
        return { bg: "#dcfce7", text: "#166534" };
      case "medium":
        return { bg: "#fef9c3", text: "#854d0e" };
      case "high":
        return { bg: "#fee2e2", text: "#b91c1c" };
    }
  };

  const handleSaveRecord = () => {
    if (!selectedDateString) return;

    onUpdateDayRecord(selectedDateString, {
      sleepTime: manualEntry.sleepTime,
      napTime: manualEntry.napTime,
      tossingCount: manualEntry.tossingCount,
      cryingCount: manualEntry.cryingCount,
      fallCount: manualEntry.fallCount,
      sleepQuality: manualEntry.sleepQuality,
      memo: memoText,
    });

    onUpdateDayMemo(selectedDateString, memoText);
    setEditMode(false);
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (
      date &&
      selectedDate &&
      date.toISOString().split("T")[0] ===
        selectedDate.toISOString().split("T")[0]
    ) {
      setSelectedDate(date);
      return;
    }

    setSelectedDate(date);
    setEditMode(false);

    if (date) {
      const dateString = date.toISOString().split("T")[0];
      const record = dayRecords.find((r) => r.date === dateString);
      setMemoText(record?.memo || "");
      if (record) {
        setManualEntry({
          sleepTime: record.sleepTime,
          napTime: record.napTime,
          tossingCount: record.tossingCount,
          cryingCount: record.cryingCount,
          fallCount: record.fallCount,
          sleepQuality: record.sleepQuality,
        });
      } else {
        setManualEntry({
          sleepTime: 0,
          napTime: 0,
          tossingCount: 0,
          cryingCount: 0,
          fallCount: 0,
          sleepQuality: "good",
        });
      }
    }
  };

  const navigateDate = (direction: "prev" | "next") => {
    if (!selectedDate) return;
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + (direction === "next" ? 1 : -1));
    handleDateSelect(newDate);
  };

  const formatSelectedDateKorean = () => {
    if (!selectedDate) return "";
    return selectedDate.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    });
  };

  // 숫자 입력 핸들러 공통
  const handleNumberChange = (field: keyof typeof manualEntry, text: string) => {
    const num = text === "" ? 0 : Number(text);
    if (Number.isNaN(num)) return;
    setManualEntry({ ...manualEntry, [field]: num });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* 캘린더 카드 (슬라이드 형식) */}
      <View style={styles.card}>
        <View style={styles.cardHeaderCenter}>
          <Text style={styles.cardTitle}>📅 수면 다이어리</Text>
        </View>

        {/* 날짜 슬라이드 네비게이션 */}
        <View style={styles.dateNavRow}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigateDate("prev")}
          >
            <Text style={styles.iconButtonText}>◀</Text>
          </TouchableOpacity>

          <View style={styles.dateTextWrapper}>
            <Text style={styles.dateText}>{formatSelectedDateKorean()}</Text>
          </View>

          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigateDate("next")}
          >
            <Text style={styles.iconButtonText}>▶</Text>
          </TouchableOpacity>
        </View>

        {/* 간단 안내: 추후 진짜 캘린더 붙일 자리 */}
        <View style={styles.fakeCalendar}>
          <Text style={styles.fakeCalendarText}>
            여기에는 추후 모바일 캘린더 컴포넌트(react-native-calendars 등)를
            붙일 수 있습니다.
          </Text>
        </View>
      </View>

      {/* 이벤트 및 데이터 표시 */}
      <View style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <Text style={styles.cardSubtitle}>
            {!editMode
              ? "수면 기록"
              : selectedDayRecord
              ? "기록 수정"
              : "수동 기록 추가"}
          </Text>

          {!editMode && selectedDayRecord && (
            <TouchableOpacity
              style={[styles.smallButton, styles.outlineButton]}
              onPress={() => setEditMode(true)}
            >
              <Text style={styles.smallButtonText}>✏ 수정</Text>
            </TouchableOpacity>
          )}
          {!editMode && !selectedDayRecord && (
            <TouchableOpacity
              style={[styles.smallButton, styles.outlineButton]}
              onPress={() => setEditMode(true)}
            >
              <Text style={styles.smallButtonText}>✏ 수동 기록 추가</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* 보기 모드 */}
        {!editMode ? (
          selectedDayRecord ? (
            <View style={styles.sectionSpace}>
              {/* 주요 수면 통계 그리드 */}
              <View style={styles.statsGrid}>
                <View style={[styles.statBox, styles.bgPurple50]}>
                  <Text style={styles.statEmoji}>🌙</Text>
                  <Text style={[styles.statValue, styles.textPurple]}>
                    {formatTime(selectedDayRecord.sleepTime)}
                  </Text>
                  <Text style={[styles.statLabel, styles.textPurpleLight]}>
                    수면 시간
                  </Text>
                </View>

                <View style={[styles.statBox, styles.bgViolet50]}>
                  <Text style={styles.statEmoji}>⏰</Text>
                  <Text style={[styles.statValue, styles.textViolet]}>
                    {formatTime(selectedDayRecord.napTime)}
                  </Text>
                  <Text style={[styles.statLabel, styles.textVioletLight]}>
                    낮잠 시간
                  </Text>
                </View>

                <View style={[styles.statBox, styles.bgIndigo50]}>
                  <Text style={styles.statEmoji}>📈</Text>
                  <Text style={[styles.statValue, styles.textIndigo]}>
                    {selectedDayRecord.tossingCount}회
                  </Text>
                  <Text style={[styles.statLabel, styles.textIndigoLight]}>
                    뒤척임 횟수
                  </Text>
                </View>

                <View style={[styles.statBox, styles.bgOrange50]}>
                  <Text style={styles.statEmoji}>📢</Text>
                  <Text style={[styles.statValue, styles.textOrange]}>
                    {selectedDayRecord.cryingCount || 0}회
                  </Text>
                  <Text style={[styles.statLabel, styles.textOrangeLight]}>
                    울음 소리
                  </Text>
                </View>

                <View style={[styles.statBox, styles.bgRed50]}>
                  <Text style={styles.statEmoji}>⚠️</Text>
                  <Text style={[styles.statValue, styles.textRed]}>
                    {selectedDayRecord.fallCount || 0}회
                  </Text>
                  <Text style={[styles.statLabel, styles.textRedLight]}>
                    낙상 감지
                  </Text>
                </View>

                <View style={[styles.statBox, styles.bgGreen50]}>
                  <Text style={styles.statEmoji}>💤</Text>
                  <View
                    style={[
                      styles.badge,
                      (() => {
                        const { bg, text } = getQualityColor(
                          selectedDayRecord.sleepQuality,
                        );
                        return { backgroundColor: bg };
                      })(),
                    ]}
                  >
                    <Text
                      style={[
                        styles.badgeText,
                        {
                          color: getQualityColor(
                            selectedDayRecord.sleepQuality,
                          ).text,
                        },
                      ]}
                    >
                      {getQualityText(selectedDayRecord.sleepQuality)}
                    </Text>
                  </View>
                  <Text style={[styles.statLabel, styles.textGreenLight]}>
                    수면 품질
                  </Text>
                </View>
              </View>

              {/* 이벤트 목록 */}
              {selectedDayRecord.events.length > 0 && (
                <View>
                  <Text style={styles.sectionTitle}>
                    🔎 감지된 이벤트 ({selectedDayRecord.events.length}건)
                  </Text>
                  <View style={styles.eventList}>
                    {selectedDayRecord.events.map((event, index) => {
                      const colors = getSeverityColor(event.severity);
                      return (
                        <View key={index} style={styles.eventItem}>
                          <View>
                            <Text style={styles.eventType}>{event.type}</Text>
                            <Text style={styles.eventTime}>{event.time}</Text>
                          </View>
                          <View style={styles.eventRight}>
                            <View
                              style={[
                                styles.badge,
                                { backgroundColor: colors.bg },
                              ]}
                            >
                              <Text
                                style={[
                                  styles.badgeText,
                                  { color: colors.text },
                                ]}
                              >
                                {event.severity === "high"
                                  ? "높음"
                                  : event.severity === "medium"
                                  ? "보통"
                                  : "낮음"}
                              </Text>
                            </View>
                            <TouchableOpacity
                              style={styles.iconButtonSmall}
                              onPress={() => {
                                setSelectedVideoEvent({
                                  type: event.type,
                                  time: event.time,
                                });
                                setShowVideoDialog(true);
                              }}
                            >
                              <Text style={styles.iconButtonSmallText}>▶</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      );
                    })}
                  </View>
                </View>
              )}

              {/* 메모 섹션 */}
              <View>
                <Text style={styles.sectionTitle}>📝 메모</Text>
                <View style={styles.memoBox}>
                  <Text style={styles.memoText}>
                    {selectedDayRecord.memo || "메모가 없습니다."}
                  </Text>
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.noRecordBox}>
              <Text style={styles.noRecordText}>
                이 날짜의 기록이 없습니다.
              </Text>
              <Text style={styles.noRecordSubText}>
                수동 기록 추가 버튼을 눌러 데이터를 입력하세요.
              </Text>
            </View>
          )
        ) : (
          // 편집 모드
          <View style={styles.sectionSpace}>
            {selectedDayRecord && (
              <Text style={styles.infoText}>
                기존 기록을 수정할 수 있습니다.
              </Text>
            )}

            {!selectedDayRecord && (
              <Text style={styles.infoTextCenter}>
                이 날짜의 자동 기록이 없습니다.{"\n"}수동으로 기록을 추가할 수
                있습니다.
              </Text>
            )}

            {/* 수동 입력 폼 */}
            <View style={styles.formGrid}>
              <View style={styles.formField}>
                <Text style={styles.label}>수면 시간 (분)</Text>
                <TextInput
                  keyboardType="numeric"
                  value={
                    manualEntry.sleepTime === 0
                      ? ""
                      : String(manualEntry.sleepTime)
                  }
                  onChangeText={(text) => handleNumberChange("sleepTime", text)}
                  placeholder="480"
                  style={styles.input}
                />
              </View>

              <View style={styles.formField}>
                <Text style={styles.label}>낮잠 시간 (분)</Text>
                <TextInput
                  keyboardType="numeric"
                  value={
                    manualEntry.napTime === 0 ? "" : String(manualEntry.napTime)
                  }
                  onChangeText={(text) => handleNumberChange("napTime", text)}
                  placeholder="90"
                  style={styles.input}
                />
              </View>

              <View style={styles.formField}>
                <Text style={styles.label}>뒤척임 횟수</Text>
                <TextInput
                  keyboardType="numeric"
                  value={
                    manualEntry.tossingCount === 0
                      ? ""
                      : String(manualEntry.tossingCount)
                  }
                  onChangeText={(text) =>
                    handleNumberChange("tossingCount", text)
                  }
                  placeholder="0"
                  style={styles.input}
                />
              </View>

              <View style={styles.formField}>
                <Text style={styles.label}>울음 소리 (회)</Text>
                <TextInput
                  keyboardType="numeric"
                  value={
                    manualEntry.cryingCount === 0
                      ? ""
                      : String(manualEntry.cryingCount)
                  }
                  onChangeText={(text) =>
                    handleNumberChange("cryingCount", text)
                  }
                  placeholder="0"
                  style={styles.input}
                />
              </View>

              <View style={styles.formField}>
                <Text style={styles.label}>낙상 감지 (회)</Text>
                <TextInput
                  keyboardType="numeric"
                  value={
                    manualEntry.fallCount === 0
                      ? ""
                      : String(manualEntry.fallCount)
                  }
                  onChangeText={(text) => handleNumberChange("fallCount", text)}
                  placeholder="0"
                  style={styles.input}
                />
              </View>

              <View style={styles.formField}>
                <Text style={styles.label}>수면 품질</Text>
                <View style={styles.qualityRow}>
                  {(["excellent", "good", "fair", "poor"] as const).map(
                    (q) => (
                      <TouchableOpacity
                        key={q}
                        style={[
                          styles.qualityButton,
                          manualEntry.sleepQuality === q &&
                            styles.qualityButtonActive,
                        ]}
                        onPress={() =>
                          setManualEntry({ ...manualEntry, sleepQuality: q })
                        }
                      >
                        <Text
                          style={[
                            styles.qualityButtonText,
                            manualEntry.sleepQuality === q &&
                              styles.qualityButtonTextActive,
                          ]}
                        >
                          {getQualityText(q)}
                        </Text>
                      </TouchableOpacity>
                    ),
                  )}
                </View>
              </View>
            </View>

            {/* 메모 작성 */}
            <View>
              <Text style={styles.label}>메모</Text>
              <TextInput
                placeholder="오늘의 특이사항, 아기 상태, 환경 변화를 기록해보세요..."
                value={memoText}
                onChangeText={setMemoText}
                multiline
                numberOfLines={3}
                style={styles.textarea}
              />
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, styles.buttonPrimary]}
                onPress={handleSaveRecord}
              >
                <Text style={styles.buttonPrimaryText}>💾 저장</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.outlineButton]}
                onPress={() => setEditMode(false)}
              >
                <Text style={styles.outlineButtonText}>취소</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {/* 영상 재생 Dialog (Modal) */}
      <Modal
        visible={showVideoDialog}
        transparent
        animationType="fade"
        onRequestClose={() => setShowVideoDialog(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>🎥 이벤트 영상</Text>
            <Text style={styles.modalDescription}>
              {selectedVideoEvent && selectedDate &&
                `${selectedVideoEvent.type} - ${selectedDate.toLocaleDateString(
                  "ko-KR",
                )} ${selectedVideoEvent.time}`}
            </Text>

            <View style={styles.videoBox}>
              <Text style={styles.videoText}>영상 재생 중...</Text>
              <Text style={styles.videoSubText}>
                실제 환경에서 녹화된 영상이 재생된다고 가정하는 영역입니다.
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.button, styles.buttonPrimary, { marginTop: 12 }]}
              onPress={() => setShowVideoDialog(false)}
            >
              <Text style={styles.buttonPrimaryText}>확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

// ===== styles =====

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 12,
    paddingBottom: 24,
  },
  card: {
    borderRadius: 16,
    padding: 12,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e9d5ff",
    marginBottom: 12,
  },
  cardHeaderCenter: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#7c3aed",
  },
  cardSubtitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },
  dateNavRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  iconButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#f9fafb",
  },
  iconButtonText: {
    fontSize: 16,
    color: "#4b5563",
  },
  dateTextWrapper: {
    flex: 1,
    alignItems: "center",
  },
  dateText: {
    fontSize: 14,
    color: "#7c3aed",
  },
  fakeCalendar: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#f9f5ff",
  },
  fakeCalendarText: {
    fontSize: 11,
    color: "#6b7280",
    textAlign: "center",
  },
  smallButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  smallButtonText: {
    fontSize: 11,
    color: "#4b5563",
  },
  outlineButton: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#ffffff",
  },
  outlineButtonText: {
    fontSize: 13,
    color: "#4b5563",
  },
  sectionSpace: {
    gap: 12,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  statBox: {
    width: "48%",
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 4,
    alignItems: "center",
    borderWidth: 1,
  },
  statEmoji: {
    fontSize: 18,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "600",
  },
  statLabel: {
    fontSize: 11,
    marginTop: 2,
  },
  bgPurple50: {
    backgroundColor: "#f5f3ff",
    borderColor: "#ede9fe",
  },
  bgViolet50: {
    backgroundColor: "#f5f3ff",
    borderColor: "#ddd6fe",
  },
  bgIndigo50: {
    backgroundColor: "#eef2ff",
    borderColor: "#e0e7ff",
  },
  bgOrange50: {
    backgroundColor: "#fff7ed",
    borderColor: "#fed7aa",
  },
  bgRed50: {
    backgroundColor: "#fee2e2",
    borderColor: "#fecaca",
  },
  bgGreen50: {
    backgroundColor: "#dcfce7",
    borderColor: "#bbf7d0",
  },
  textPurple: {
    color: "#7c3aed",
  },
  textPurpleLight: {
    color: "#a855f7",
  },
  textViolet: {
    color: "#6366f1",
  },
  textVioletLight: {
    color: "#4f46e5",
  },
  textIndigo: {
    color: "#4f46e5",
  },
  textIndigoLight: {
    color: "#6366f1",
  },
  textOrange: {
    color: "#c2410c",
  },
  textOrangeLight: {
    color: "#ea580c",
  },
  textRed: {
    color: "#b91c1c",
  },
  textRedLight: {
    color: "#dc2626",
  },
  textGreenLight: {
    color: "#15803d",
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 4,
    color: "#6b21a8",
  },
  eventList: {
    gap: 6,
  },
  eventItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 8,
    borderRadius: 10,
    backgroundColor: "#faf5ff",
    borderWidth: 1,
    borderColor: "#e9d5ff",
  },
  eventType: {
    fontSize: 13,
    color: "#111827",
  },
  eventTime: {
    fontSize: 11,
    color: "#6b7280",
  },
  eventRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  iconButtonSmall: {
    width: 24,
    height: 24,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
  },
  iconButtonSmallText: {
    fontSize: 11,
    color: "#7c3aed",
  },
  memoBox: {
    borderRadius: 10,
    backgroundColor: "#f5f3ff",
    padding: 8,
    minHeight: 60,
  },
  memoText: {
    fontSize: 13,
    color: "#4b5563",
  },
  noRecordBox: {
    alignItems: "center",
    paddingVertical: 24,
  },
  noRecordText: {
    fontSize: 13,
    color: "#6b7280",
    marginBottom: 4,
  },
  noRecordSubText: {
    fontSize: 11,
    color: "#9ca3af",
    textAlign: "center",
  },
  infoText: {
    fontSize: 12,
    color: "#7c3aed",
    backgroundColor: "#f5f3ff",
    padding: 8,
    borderRadius: 8,
  },
  infoTextCenter: {
    fontSize: 12,
    color: "#4b5563",
    textAlign: "center",
    marginBottom: 8,
  },
  formGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  formField: {
    width: "48%",
  },
  label: {
    fontSize: 12,
    color: "#374151",
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
    fontSize: 13,
    backgroundColor: "#ffffff",
  },
  textarea: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
    fontSize: 13,
    backgroundColor: "#ffffff",
    minHeight: 80,
    textAlignVertical: "top",
  },
  qualityRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  qualityButton: {
    flexGrow: 1,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    alignItems: "center",
  },
  qualityButtonActive: {
    backgroundColor: "#f5f3ff",
    borderColor: "#c4b5fd",
  },
  qualityButtonText: {
    fontSize: 11,
    color: "#6b7280",
  },
  qualityButtonTextActive: {
    color: "#7c3aed",
    fontWeight: "600",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 4,
  },
  button: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 999,
    alignItems: "center",
  },
  buttonPrimary: {
    backgroundColor: "#a855f7",
  },
  buttonPrimaryText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 13,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  modalContent: {
    width: "100%",
    borderRadius: 16,
    backgroundColor: "#ffffff",
    padding: 16,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#7c3aed",
    marginBottom: 4,
  },
  modalDescription: {
    fontSize: 12,
    color: "#4b5563",
    marginBottom: 12,
  },
  videoBox: {
    backgroundColor: "#000000",
    borderRadius: 12,
    paddingVertical: 24,
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  videoText: {
    color: "#ffffff",
    fontSize: 13,
    marginBottom: 4,
  },
  videoSubText: {
    color: "#e5e7eb",
    fontSize: 11,
    textAlign: "center",
  },
});
