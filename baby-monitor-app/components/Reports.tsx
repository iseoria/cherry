// Reports.tsx

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import Svg, {
  Polyline,
  Circle,
  Line as SvgLine,
  Rect,
} from "react-native-svg";

interface DayRecord {
  date: string;
  events: Array<{
    type: string;
    time: string;
    severity: "low" | "medium" | "high";
  }>;
  sleepTime: number;
  napTime: number;
  sleepQuality: "excellent" | "good" | "fair" | "poor";
  tossingCount: number;
  cryingCount: number;
  fallCount: number;
  memo: string;
}

interface ReportsProps {
  dayRecords: DayRecord[];
}

type Range = "daily" | "weekly" | "monthly";

interface ChartPoint {
  label: string;
  value: number;
}

// ===== 라인 차트 컴포넌트 =====
const LineChart: React.FC<{
  data: ChartPoint[];
  color: string;
}> = ({ data, color }) => {
  const width = 280;
  const height = 120;
  const padding = 20;

  const maxValue = Math.max(...data.map((d) => d.value || 0), 1);
  const innerWidth = width - padding * 2;
  const innerHeight = height - padding * 2;
  const stepX = data.length > 1 ? innerWidth / (data.length - 1) : 0;

  const points = data.map((d, idx) => {
    const x = padding + stepX * idx;
    const y =
      padding + innerHeight - (d.value / maxValue) * innerHeight;
    return { x, y };
  });

  const polyPointsStr = points.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <View style={{ marginTop: 8 }}>
      <Svg width="100%" height={height}>
        {/* 수평 그리드 */}
        {[0, 1, 2, 3].map((i) => {
          const y = padding + (innerHeight / 3) * i;
          return (
            <SvgLine
              key={i}
              x1={padding}
              x2={width - padding}
              y1={y}
              y2={y}
              stroke="#e5e7eb"
              strokeDasharray="4 4"
              strokeWidth={1}
            />
          );
        })}
        {/* 꺾은선 */}
        <Polyline
          points={polyPointsStr}
          fill="none"
          stroke={color}
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* 점 */}
        {points.map((p, idx) => (
          <Circle
            key={idx}
            cx={p.x}
            cy={p.y}
            r={4}
            fill={color}
          />
        ))}
      </Svg>

      {/* X축 라벨 */}
      <View style={styles.axisLabelRow}>
        {data.map((d, idx) => (
          <Text key={idx} style={styles.axisLabel}>
            {d.label}
          </Text>
        ))}
      </View>
    </View>
  );
};

// ===== 바 차트 컴포넌트 (뒤척임) =====
const BarChart: React.FC<{
  data: ChartPoint[];
  color: string;
}> = ({ data, color }) => {
  const width = 280;
  const height = 120;
  const padding = 20;

  const maxValue = Math.max(...data.map((d) => d.value || 0), 1);
  const innerWidth = width - padding * 2;
  const innerHeight = height - padding * 2;
  const barWidth =
    data.length > 0 ? innerWidth / data.length - 4 : 10;

  return (
    <View style={{ marginTop: 8 }}>
      <Svg width="100%" height={height}>
        {/* 수평 그리드 */}
        {[0, 1, 2, 3].map((i) => {
          const y = padding + (innerHeight / 3) * i;
          return (
            <SvgLine
              key={i}
              x1={padding}
              x2={width - padding}
              y1={y}
              y2={y}
              stroke="#e5e7eb"
              strokeDasharray="4 4"
              strokeWidth={1}
            />
          );
        })}

        {data.map((d, idx) => {
          const x =
            padding +
            (innerWidth / data.length) * idx +
            (innerWidth / data.length - barWidth) / 2;
          const barHeight =
            (d.value / maxValue) * innerHeight;
          const y = padding + innerHeight - barHeight;

          return (
            <Rect
              key={idx}
              x={x}
              y={y}
              width={barWidth}
              height={barHeight}
              rx={4}
              ry={4}
              fill={color}
            />
          );
        })}
      </Svg>

      {/* X축 라벨 */}
      <View style={styles.axisLabelRow}>
        {data.map((d, idx) => (
          <Text key={idx} style={styles.axisLabel}>
            {d.label}
          </Text>
        ))}
      </View>
    </View>
  );
};

const Reports: React.FC<ReportsProps> = ({ dayRecords }) => {
  const [analysisRange, setAnalysisRange] =
    useState<Range>("daily");
  const [startDate, setStartDate] = useState<string>(
    new Date().toISOString().split("T")[0],
  );
  const [showGraphs, setShowGraphs] = useState(false);

  const getDaysCount = () => {
    switch (analysisRange) {
      case "daily":
        return 1;
      case "weekly":
        return 7;
      case "monthly":
        return 30;
    }
  };

  const makeDateLabels = () => {
    const daysCount = getDaysCount();
    const start = new Date(startDate);
    const dates: string[] = [];

    for (let i = 0; i < daysCount; i++) {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      dates.push(d.toISOString().split("T")[0]);
    }
    return dates;
  };

  // 수면 시간 추이 (수면 + 낮잠, 시간 단위)
  const getSleepTimeAnalysis = () => {
    const dates = makeDateLabels();

    return dates.map((dateStr) => {
      const record = dayRecords.find(
        (r) => r.date === dateStr,
      );
      const totalMinutes = record
        ? record.sleepTime + record.napTime
        : 0;
      const hours = totalMinutes / 60;

      const d = new Date(dateStr);
      const label = d.toLocaleDateString("ko-KR", {
        month: "short",
        day: "numeric",
      });

      return {
        label,
        hours: Math.round(hours * 10) / 10,
      };
    });
  };

  // 뒤척임 추이
  const getTossingAnalysis = () => {
    const dates = makeDateLabels();

    return dates.map((dateStr) => {
      const record = dayRecords.find(
        (r) => r.date === dateStr,
      );
      const count = record ? record.tossingCount : 0;

      const d = new Date(dateStr);
      const label = d.toLocaleDateString("ko-KR", {
        month: "short",
        day: "numeric",
      });

      return { label, count };
    });
  };

  // 수면 질 추이 (점수화)
  const getSleepQualityAnalysis = () => {
    const dates = makeDateLabels();

    const qualityToScore = (
      quality: "excellent" | "good" | "fair" | "poor",
    ) => {
      switch (quality) {
        case "excellent":
          return 95;
        case "good":
          return 80;
        case "fair":
          return 60;
        case "poor":
          return 40;
      }
    };

    return dates.map((dateStr) => {
      const record = dayRecords.find(
        (r) => r.date === dateStr,
      );
      const score = record
        ? qualityToScore(record.sleepQuality)
        : 0;

      const d = new Date(dateStr);
      const label = d.toLocaleDateString("ko-KR", {
        month: "short",
        day: "numeric",
      });

      return { label, score };
    });
  };

  const qualityToScore = (
    quality: "excellent" | "good" | "fair" | "poor",
  ) => {
    switch (quality) {
      case "excellent":
        return 95;
      case "good":
        return 80;
      case "fair":
        return 60;
      case "poor":
        return 40;
    }
  };

  // ===== AI 분석 생성 (기존 그대로) =====
  const generateDetailedAIAnalysis = () => {
    const daysCount = getDaysCount();
    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(end.getDate() + daysCount);

    const relevantRecords = dayRecords.filter((record) => {
      const recordDate = new Date(record.date);
      return recordDate >= start && recordDate < end;
    });

    if (relevantRecords.length === 0) {
      return {
        summary: "선택한 기간에 데이터가 없습니다.",
        sleepPattern: [] as string[],
        recommendations: [] as string[],
        concerns: [] as {
          type: "danger" | "warning";
          title: string;
          description: string;
        }[],
      };
    }

    const avgTossing =
      relevantRecords.reduce(
        (sum, record) => sum + record.tossingCount,
        0,
      ) / relevantRecords.length;

    const avgSleepHours =
      relevantRecords.reduce(
        (sum, record) =>
          sum + (record.sleepTime + record.napTime),
        0,
      ) /
      relevantRecords.length /
      60;

    const avgQualityScore =
      relevantRecords.reduce(
        (sum, record) =>
          sum + qualityToScore(record.sleepQuality),
        0,
      ) / relevantRecords.length;

    const totalCrying = relevantRecords.reduce(
      (sum, record) => sum + record.cryingCount,
      0,
    );
    const totalFallDetection = relevantRecords.reduce(
      (sum, record) => sum + record.fallCount,
      0,
    );

    const rangeText =
      analysisRange === "daily"
        ? "일간"
        : analysisRange === "weekly"
        ? "주간"
        : "월간";

    const sleepPattern: string[] = [
      `선택한 ${rangeText} 기간 동안 총 ${relevantRecords.length}일의 수면 데이터를 분석했습니다.`,
      `평균 수면 시간은 ${
        Math.round(avgSleepHours * 10) / 10
      }시간으로 ${
        avgSleepHours >= 8
          ? "권장 수면 시간을 충족하고 있습니다"
          : "권장 수면 시간보다 부족합니다"
      }.`,
      `평균 뒤척임 횟수는 ${Math.round(avgTossing)}회로 ${
        avgTossing < 10
          ? "안정적인 수면 상태"
          : avgTossing < 20
          ? "보통 수준"
          : "다소 불안정한 수면 상태"
      }를 보이고 있습니다.`,
      `수면 품질 점수는 평균 ${Math.round(
        avgQualityScore,
      )}점으로 ${
        avgQualityScore >= 85
          ? "우수한"
          : avgQualityScore >= 70
          ? "양호한"
          : avgQualityScore >= 50
          ? "보통"
          : "낮은"
      } 수준입니다.`,
    ];

    const concerns: {
      type: "danger" | "warning";
      title: string;
      description: string;
    }[] = [];

    if (totalFallDetection > 0) {
      concerns.push({
        type: "danger",
        title: "낙상 위험 감지",
        description: `${totalFallDetection}건의 낙상이 감지되었습니다. 침대 안전 장치 점검이 필요합니다.`,
      });
    }

    if (totalCrying > relevantRecords.length * 3) {
      concerns.push({
        type: "warning",
        title: "울음 빈도 증가",
        description: `일평균 ${
          Math.round(
            (totalCrying / relevantRecords.length) * 10,
          ) / 10
        }회의 울음이 감지되었습니다. 수면 환경이나 컨디션 확인이 필요할 수 있습니다.`,
      });
    }

    if (avgTossing > 20) {
      concerns.push({
        type: "warning",
        title: "뒤척임 빈도 높음",
        description:
          "평균 이상의 뒤척임이 관찰되었습니다. 침구 온도, 습도, 편안함 등을 점검해보세요.",
      });
    }

    if (avgSleepHours < 7) {
      concerns.push({
        type: "warning",
        title: "수면 시간 부족",
        description:
          "영유아에게 필요한 권장 수면 시간보다 부족합니다. 수면 일정 조정을 고려하세요.",
      });
    }

    const recommendations: string[] = [];
    if (avgQualityScore >= 85) {
      recommendations.push(
        "현재 수면 패턴이 매우 좋습니다. 현재 환경과 루틴을 유지하세요.",
      );
    }
    recommendations.push(
      "일정한 수면 시간을 유지하여 생체 리듬을 안정화하세요.",
    );
    if (avgTossing > 10) {
      recommendations.push(
        "뒤척임이 많은 시간대에는 실내 온도를 18-20도로 유지하고 습도를 40-60%로 조절하세요.",
      );
    }
    if (totalCrying > 0) {
      recommendations.push(
        "울음이 자주 발생하는 시간대를 파악하여 선제적으로 대응하세요.",
      );
    }
    recommendations.push(
      "수면 전 안정적인 루틴(목욕, 마사지, 자장가 등)을 만들어 보세요.",
    );
    recommendations.push(
      "낮 시간 충분한 활동으로 밤 수면의 질을 높이세요.",
    );

    const summary = `${
      analysisRange === "daily"
        ? "오늘"
        : analysisRange === "weekly"
        ? "이번 주"
        : "이번 달"
    } 수면 패턴은 전반적으로 ${
      avgQualityScore >= 70 ? "양호" : "개선이 필요"
    }합니다.`;

    return { summary, sleepPattern, recommendations, concerns };
  };

  const sleepTimeData = getSleepTimeAnalysis();
  const tossingData = getTossingAnalysis();
  const sleepQualityData = getSleepQualityAnalysis();
  const aiAnalysis = generateDetailedAIAnalysis();

  const getStats = () => {
    if (dayRecords.length === 0) {
      return {
        avgSleep: 0,
        avgTossing: 0,
        avgQuality: 0,
        totalEvents: 0,
      };
    }

    const avgSleep =
      dayRecords.reduce(
        (sum, r) => sum + (r.sleepTime + r.napTime),
        0,
      ) / dayRecords.length / 60;

    const avgTossing =
      dayRecords.reduce(
        (sum, r) => sum + r.tossingCount,
        0,
      ) / dayRecords.length;

    const avgQuality =
      dayRecords.reduce(
        (sum, r) => sum + qualityToScore(r.sleepQuality),
        0,
      ) / dayRecords.length;

    const totalEvents = dayRecords.reduce(
      (sum, r) => sum + r.events.length,
      0,
    );

    return { avgSleep, avgTossing, avgQuality, totalEvents };
  };

  const stats = getStats();

  // ===== 그래프 모드 UI =====
  if (showGraphs) {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        {/* 분석 기간 카드 */}
        <View style={[styles.card, styles.cardPurpleSoft]}>
          <View style={styles.rowBetween}>
            <View style={styles.rowCenter}>
              <Text style={styles.iconText}>📅</Text>
              <Text style={styles.cardTitlePurple}>분석 기간</Text>
            </View>
          </View>

          <View style={styles.rangeRow}>
            {/* 기간 선택 */}
            <View style={styles.rangeBox}>
              <Text style={styles.label}>기간</Text>
              <View style={styles.chipRow}>
                {(["daily", "weekly", "monthly"] as Range[]).map(
                  (r) => (
                    <TouchableOpacity
                      key={r}
                      style={[
                        styles.chip,
                        analysisRange === r &&
                          styles.chipActive,
                      ]}
                      onPress={() => setAnalysisRange(r)}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          analysisRange === r &&
                            styles.chipTextActive,
                        ]}
                      >
                        {r === "daily"
                          ? "일간"
                          : r === "weekly"
                          ? "주간"
                          : "월간"}
                      </Text>
                    </TouchableOpacity>
                  ),
                )}
              </View>
            </View>

            {/* 시작 날짜 입력 */}
            <View style={styles.rangeBox}>
              <Text style={styles.label}>시작 날짜</Text>
              <TextInput
                value={startDate}
                onChangeText={setStartDate}
                placeholder="YYYY-MM-DD"
                style={styles.input}
              />
            </View>
          </View>
        </View>

        {/* AI 분석으로 돌아가는 카드 */}
        <TouchableOpacity
          style={[styles.card, styles.cardGradientPurple]}
          onPress={() => setShowGraphs(false)}
          activeOpacity={0.8}
        >
          <View style={styles.rowBetween}>
            <View style={styles.rowCenter}>
              <Text style={styles.iconText}>🧠</Text>
              <View>
                <Text style={styles.cardTitlePurple}>AI 분석</Text>
                <Text style={styles.cardSubtitlePurple}>
                  상세한 수면 분석 리포트 보기
                </Text>
              </View>
            </View>
            <Text style={styles.arrowText}>‹</Text>
          </View>
        </TouchableOpacity>

        {/* 그래프 카드 */}
        <View style={[styles.card, styles.cardBorderPurple]}>
          <View style={styles.rowBetween}>
            <Text style={styles.cardTitle}>분석 그래프</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {analysisRange === "daily"
                  ? "일간"
                  : analysisRange === "weekly"
                  ? "주간"
                  : "월간"}
              </Text>
            </View>
          </View>

          {/* 수면 시간 추이 (라인) */}
          <View style={styles.graphBlock}>
            <Text style={styles.graphTitle}>
              ⏱ 수면 시간 추이 (수면+낮잠)
            </Text>
            <LineChart
              data={sleepTimeData.map((d) => ({
                label: d.label,
                value: d.hours,
              }))}
              color="#a855f7"
            />
          </View>

          {/* 뒤척임 추이 (바) */}
          <View style={styles.graphBlock}>
            <Text style={styles.graphTitle}>📈 뒤척임 추이</Text>
            <BarChart
              data={tossingData.map((d) => ({
                label: d.label,
                value: d.count,
              }))}
              color="#6366f1"
            />
          </View>

          {/* 수면 질 점수 추이 (라인) */}
          <View style={styles.graphBlock}>
            <Text style={styles.graphTitle}>
              💤 수면 질 분석 추이
            </Text>
            <LineChart
              data={sleepQualityData.map((d) => ({
                label: d.label,
                value: d.score,
              }))}
              color="#10b981"
            />
          </View>
        </View>

        {/* 통계 요약 */}
        <View style={[styles.card, styles.cardGradientSoft]}>
          <Text style={styles.cardTitlePurple}>기간 내 통계</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>
                평균 수면시간
              </Text>
              <Text
                style={[styles.statValue, styles.textPurple]}
              >
                {Math.round(stats.avgSleep * 10) / 10}시간
              </Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>
                평균 뒤척임
              </Text>
              <Text
                style={[styles.statValue, styles.textIndigo]}
              >
                {Math.round(stats.avgTossing)}회
              </Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>
                평균 수면 품질
              </Text>
              <Text
                style={[styles.statValue, styles.textGreen]}
              >
                {Math.round(stats.avgQuality)}점
              </Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>총 이벤트</Text>
              <Text
                style={[styles.statValue, styles.textOrange]}
              >
                {stats.totalEvents}건
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }

  // ===== 기본 AI 리포트 모드 =====
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      {/* 분석 기간 카드 */}
      <View style={[styles.card, styles.cardPurpleSoft]}>
        <View style={styles.rowBetween}>
          <View style={styles.rowCenter}>
            <Text style={styles.iconText}>📅</Text>
            <Text style={styles.cardTitlePurple}>분석 기간</Text>
          </View>
        </View>

        <View style={styles.rangeRow}>
          {/* 기간 선택 */}
          <View style={styles.rangeBox}>
            <Text style={styles.label}>기간</Text>
            <View style={styles.chipRow}>
              {(["daily", "weekly", "monthly"] as Range[]).map(
                (r) => (
                  <TouchableOpacity
                    key={r}
                    style={[
                      styles.chip,
                      analysisRange === r &&
                        styles.chipActive,
                    ]}
                    onPress={() => setAnalysisRange(r)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        analysisRange === r &&
                          styles.chipTextActive,
                      ]}
                    >
                      {r === "daily"
                        ? "일간"
                        : r === "weekly"
                        ? "주간"
                        : "월간"}
                    </Text>
                  </TouchableOpacity>
                ),
              )}
            </View>
          </View>

          {/* 시작 날짜 */}
          <View style={styles.rangeBox}>
            <Text style={styles.label}>시작 날짜</Text>
            <TextInput
              value={startDate}
              onChangeText={setStartDate}
              placeholder="YYYY-MM-DD"
              style={styles.input}
            />
          </View>
        </View>
      </View>

      {/* AI 분석 카드 */}
      <View style={[styles.card, styles.cardGradientSoft]}>
        <View style={styles.rowCenter}>
          <Text style={styles.iconText}>🧠</Text>
          <Text style={styles.cardTitlePurple}>
            AI 수면 분석 리포트
          </Text>
        </View>

        <View style={styles.summaryBox}>
          <Text style={styles.summaryText}>
            {aiAnalysis.summary}
          </Text>
        </View>

        {/* 수면 패턴 */}
        <View style={styles.section}>
          <View style={styles.rowCenter}>
            <Text style={styles.iconTextSmall}>📈</Text>
            <Text style={styles.sectionTitle}>
              수면 패턴 분석
            </Text>
          </View>
          <View
            style={[styles.bubbleBox, styles.bubbleBlue]}
          >
            {aiAnalysis.sleepPattern.map((line, idx) => (
              <Text key={idx} style={styles.bulletBlue}>
                • {line}
              </Text>
            ))}
          </View>
        </View>

        {/* 우려사항 */}
        {aiAnalysis.concerns.length > 0 && (
          <View style={styles.section}>
            <View style={styles.rowCenter}>
              <Text style={styles.iconTextSmall}>⚠️</Text>
              <Text style={styles.sectionTitle}>주의사항</Text>
            </View>
            <View style={{ gap: 6 }}>
              {aiAnalysis.concerns.map((c, idx) => (
                <View
                  key={idx}
                  style={[
                    styles.alertBox,
                    c.type === "danger"
                      ? styles.alertDanger
                      : styles.alertWarning,
                  ]}
                >
                  <Text
                    style={[
                      styles.alertTitle,
                      c.type === "danger"
                        ? styles.alertTitleDanger
                        : styles.alertTitleWarning,
                    ]}
                  >
                    {c.title}
                  </Text>
                  <Text
                    style={[
                      styles.alertText,
                      c.type === "danger"
                        ? styles.alertTextDanger
                        : styles.alertTextWarning,
                    ]}
                  >
                    {c.description}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* 권장사항 */}
        <View style={styles.section}>
          <View style={styles.rowCenter}>
            <Text style={styles.iconTextSmall}>💡</Text>
            <Text style={styles.sectionTitle}>
              개선 권장사항
            </Text>
          </View>
          <View
            style={[styles.bubbleBox, styles.bubbleGreen]}
          >
            {aiAnalysis.recommendations.map((r, idx) => (
              <Text key={idx} style={styles.bulletGreen}>
                • {r}
              </Text>
            ))}
          </View>
        </View>

        {/* 안내 문구 */}
        <View style={styles.noticeBox}>
          <Text style={styles.noticeText}>
            💡 이 분석은 AI가 수면 데이터를 기반으로 생성한
            것입니다. 지속적인 문제가 있다면 전문가와
            상담하세요.
          </Text>
        </View>
      </View>

      {/* 그래프 보기 카드 */}
      <TouchableOpacity
        style={[styles.card, styles.cardGradientPurple]}
        onPress={() => setShowGraphs(true)}
        activeOpacity={0.8}
      >
        <View style={styles.rowBetween}>
          <View style={styles.rowCenter}>
            <Text style={styles.iconText}>📊</Text>
            <View>
              <Text style={styles.cardTitlePurple}>
                분석 그래프
              </Text>
              <Text style={styles.cardSubtitlePurple}>
                수면 시간, 뒤척임, 수면 질 추이 그래프 보기
              </Text>
            </View>
          </View>
          <Text style={styles.arrowText}>›</Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Reports;

// ========== 스타일 ==========
const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 12, paddingBottom: 24, gap: 10 },
  card: {
    borderRadius: 16,
    padding: 12,
    backgroundColor: "#ffffff",
  },
  cardPurpleSoft: {
    backgroundColor: "#faf5ff",
    borderWidth: 1,
    borderColor: "#e9d5ff",
  },
  cardBorderPurple: {
    borderWidth: 1,
    borderColor: "#e9d5ff",
  },
  cardGradientSoft: {
    backgroundColor: "#f5f3ff",
    borderWidth: 1,
    borderColor: "#e9d5ff",
  },
  cardGradientPurple: {
    backgroundColor: "#ede9fe",
    borderWidth: 1,
    borderColor: "#c4b5fd",
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rowCenter: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconText: { fontSize: 18, marginRight: 6 },
  iconTextSmall: { fontSize: 16, marginRight: 6 },
  cardTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },
  cardTitlePurple: {
    fontSize: 15,
    fontWeight: "600",
    color: "#7c3aed",
  },
  cardSubtitlePurple: {
    fontSize: 11,
    color: "#6b21a8",
    marginTop: 2,
  },
  arrowText: {
    fontSize: 18,
    color: "#a855f7",
  },
  rangeRow: {
    flexDirection: "row",
    marginTop: 8,
    gap: 10,
  },
  rangeBox: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: "#4b5563",
    marginBottom: 4,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  chip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#ffffff",
  },
  chipActive: {
    backgroundColor: "#ede9fe",
    borderColor: "#a855f7",
  },
  chipText: {
    fontSize: 11,
    color: "#6b7280",
  },
  chipTextActive: {
    color: "#7c3aed",
    fontWeight: "600",
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
  summaryBox: {
    marginTop: 10,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 10,
  },
  summaryText: {
    fontSize: 13,
    color: "#6d28d9",
  },
  section: {
    marginTop: 10,
    gap: 4,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111827",
  },
  bubbleBox: {
    borderRadius: 10,
    padding: 8,
    gap: 3,
  },
  bubbleBlue: {
    backgroundColor: "#eff6ff",
  },
  bubbleGreen: {
    backgroundColor: "#ecfdf5",
  },
  bulletBlue: {
    fontSize: 12,
    color: "#1d4ed8",
  },
  bulletGreen: {
    fontSize: 12,
    color: "#15803d",
  },
  alertBox: {
    borderRadius: 10,
    padding: 8,
    borderLeftWidth: 4,
  },
  alertDanger: {
    backgroundColor: "#fee2e2",
    borderLeftColor: "#ef4444",
  },
  alertWarning: {
    backgroundColor: "#fef3c7",
    borderLeftColor: "#f59e0b",
  },
  alertTitle: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 2,
  },
  alertTitleDanger: {
    color: "#b91c1c",
  },
  alertTitleWarning: {
    color: "#92400e",
  },
  alertText: {
    fontSize: 12,
  },
  alertTextDanger: {
    color: "#b91c1c",
  },
  alertTextWarning: {
    color: "#92400e",
  },
  noticeBox: {
    marginTop: 10,
    borderRadius: 10,
    backgroundColor: "#faf5ff",
    padding: 8,
  },
  noticeText: {
    fontSize: 11,
    color: "#6b21a8",
  },
  badge: {
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: "#f5f3ff",
  },
  badgeText: {
    fontSize: 11,
    color: "#7c3aed",
  },
  graphBlock: {
    marginTop: 10,
    gap: 4,
  },
  graphTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111827",
  },
  axisLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  axisLabel: {
    fontSize: 10,
    color: "#6b7280",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
  },
  statBox: {
    width: "48%",
    backgroundColor: "#ffffff",
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  statLabel: {
    fontSize: 11,
    color: "#6b7280",
    marginBottom: 2,
  },
  statValue: {
    fontSize: 13,
    fontWeight: "600",
  },
  textPurple: {
    color: "#7c3aed",
  },
  textIndigo: {
    color: "#4f46e5",
  },
  textGreen: {
    color: "#16a34a",
  },
  textOrange: {
    color: "#ea580c",
  },
});
