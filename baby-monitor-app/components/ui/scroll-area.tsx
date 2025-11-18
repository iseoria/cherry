// src/ui/scroll-area.tsx (React Native 버전)

import React from 'react';
import {
  ScrollView,
  ScrollViewProps,
  StyleSheet,
  ViewStyle,
} from 'react-native';

export interface ScrollAreaProps extends ScrollViewProps {
  contentContainerStyle?: ViewStyle | ViewStyle[];
}

/**
 * 웹의 ScrollArea 대신 사용하는 RN용 래퍼
 * - 기본적으로 vertical 스크롤
 * - 필요하면 horizontal, nestedScrollEnabled 등은 props로 그대로 넘기면 됨
 */
export const ScrollArea: React.FC<ScrollAreaProps> = ({
  children,
  style,
  contentContainerStyle,
  ...rest
}) => {
  return (
    <ScrollView
      style={[styles.container, style]}
      contentContainerStyle={[styles.contentContainer, contentContainerStyle]}
      showsVerticalScrollIndicator={false}
      {...rest}
    >
      {children}
    </ScrollView>
  );
};

/**
 * shadcn 호환용 더미 ScrollBar
 * - RN에서는 기본 스크롤바를 쓰기 때문에 실제 UI는 렌더링하지 않음
 * - 타입/이름만 맞춰서 import 에러 방지용
 */
export interface ScrollBarProps {
  orientation?: 'vertical' | 'horizontal';
  style?: ViewStyle;
}

export const ScrollBar: React.FC<ScrollBarProps> = () => null;

const styles = StyleSheet.create({
  container: {
    // 필요하면 여기서 배경색 등 공통 스타일 지정
  },
  contentContainer: {
    // 기본 padding 등을 여기서 줄 수도 있음
  },
});

export default ScrollArea;
