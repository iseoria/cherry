// src/ui/calendar.tsx (React Native 버전)

import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';

export interface CalendarProps {
  // 선택된 날짜 (없으면 null/undefined)
  selected?: Date | null;
  // 날짜 선택 콜백
  onSelect?: (date: Date) => void;
  // 처음 보여줄 달 (기본: 오늘 기준)
  initialMonth?: Date;
}

const weekdayLabels = ['일', '월', '화', '수', '목', '금', '토'];

const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const Calendar: React.FC<CalendarProps> = ({
  selected = null,
  onSelect,
  initialMonth,
}) => {
  const [currentMonth, setCurrentMonth] = useState<Date>(
    initialMonth ?? new Date()
  );

  const { weeks, monthLabel } = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth(); // 0-11

    // 이번 달 1일
    const firstDay = new Date(year, month, 1);
    const firstWeekday = firstDay.getDay(); // 0=일 ~ 6=토

    // 이번 달 마지막 날짜
    const lastDay = new Date(year, month + 1, 0);
    const lastDate = lastDay.getDate();

    const days: (Date | null)[] = [];

    // 앞쪽 빈칸 (이전 달)
    for (let i = 0; i < firstWeekday; i++) {
      days.push(null);
    }

    // 이번 달 날짜
    for (let d = 1; d <= lastDate; d++) {
      days.push(new Date(year, month, d));
    }

    // 7일씩 끊어서 weeks로
    const weeks: (Date | null)[][] = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }

    const monthLabel = `${year}년 ${month + 1}월`;

    return { weeks, monthLabel };
  }, [currentMonth]);

  const handlePrevMonth = () => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  return (
    <View style={styles.container}>
      {/* 상단 헤더 (이전/다음 달, 현재 월 표시) */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handlePrevMonth} style={styles.navButton}>
          <Text style={styles.navText}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.monthLabel}>{monthLabel}</Text>
        <TouchableOpacity onPress={handleNextMonth} style={styles.navButton}>
          <Text style={styles.navText}>{'>'}</Text>
        </TouchableOpacity>
      </View>

      {/* 요일 헤더 */}
      <View style={styles.weekRow}>
        {weekdayLabels.map((label) => (
          <View key={label} style={styles.weekdayCell}>
            <Text style={styles.weekdayText}>{label}</Text>
          </View>
        ))}
      </View>

      {/* 날짜 그리드 */}
      {weeks.map((week, i) => (
        <View key={i} style={styles.weekRow}>
          {week.map((date, j) => {
            if (!date) {
              return <View key={j} style={styles.dayCell} />;
            }

            const isSelected = selected && sameDay(selected, date);

            const dayContainerStyle: ViewStyle[] = [styles.dayInner];
            const dayTextStyle: TextStyle[] = [styles.dayText];

            if (isSelected) {
              dayContainerStyle.push(styles.daySelected);
              dayTextStyle.push(styles.daySelectedText);
            }

            return (
              <TouchableOpacity
                key={j}
                style={styles.dayCell}
                onPress={() => onSelect?.(date)}
                activeOpacity={0.7}
              >
                <View style={dayContainerStyle}>
                  <Text style={dayTextStyle}>{date.getDate()}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
    </View>
  );
};

export default Calendar;

// 스타일
const styles = StyleSheet.create({
  container: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  monthLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  navButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  navText: {
    fontSize: 16,
    fontWeight: '500',
  },
  weekRow: {
    flexDirection: 'row',
  },
  weekdayCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
  },
  weekdayText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6b7280',
  },
  dayCell: {
    flex: 1,
    paddingVertical: 4,
    alignItems: 'center',
  },
  dayInner: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayText: {
    fontSize: 14,
    color: '#111827',
  },
  daySelected: {
    backgroundColor: '#b19cd9', // primary
  },
  daySelectedText: {
    color: '#ffffff',
    fontWeight: '600',
  },
});
