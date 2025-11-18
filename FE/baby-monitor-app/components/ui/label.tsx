// components/ui/label.tsx  – React Native용 Label 컴포넌트

import React, { ReactNode } from "react";
import {
  Text,
  StyleSheet,
  TextStyle,
  TextProps,
  View,
  ViewStyle,
} from "react-native";

export interface LabelProps extends TextProps {
  children?: ReactNode;
  /** 에러일 때 빨간색으로 표시하고 싶으면 true */
  error?: boolean;
  /** 라벨을 감싸는 컨테이너 스타일 (margin 등) */
  containerStyle?: ViewStyle;
}

/**
 * 웹의 <label> 느낌을 내는 간단한 RN Label.
 * htmlFor 같은 건 RN에 개념이 없어서 그냥 텍스트 스타일만 담당하게 둔다.
 */
export const Label: React.FC<LabelProps> = ({
  children,
  style,
  error,
  containerStyle,
  ...rest
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <Text
        {...rest}
        style={[styles.base, error && styles.error, style as TextStyle]}
      >
        {children}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create<{
  container: ViewStyle;
  base: TextStyle;
  error: TextStyle;
}>({
  container: {
    marginBottom: 4, // 인풋 위에 살짝 간격
  },
  base: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151", // text-gray-700 느낌
  },
  error: {
    color: "#DC2626", // text-red-600
  },
});

export default Label;
