// app/components/ui/badge.tsx (React Native 버전)

import React, { ReactNode } from "react";
import {
  View,
  Text,
  StyleSheet,
  ViewProps,
  ViewStyle,
  TextStyle,
} from "react-native";

type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

interface BadgeProps extends ViewProps {
  variant?: BadgeVariant;
  children?: ReactNode;
  textStyle?: TextStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = "default",
  children,
  style,
  textStyle,
  ...rest
}) => {
  // View 스타일: RN 기본 패턴대로 배열로 전달 (타입 추론에 맡김)
  const containerStyle = [styles.base, styles[variant], style];

  // Text 스타일: textStyle 이 optional 이라 그대로 배열에 넣어도 OK
  const labelStyle = [
    styles.textBase,
    styles[`${variant}Text` as const],
    textStyle,
  ];

  return (
    <View style={containerStyle} {...rest}>
      {typeof children === "string" ? (
        <Text style={labelStyle}>{children}</Text>
      ) : (
        children
      )}
    </View>
  );
};

const styles = StyleSheet.create<{
  base: ViewStyle;
  textBase: TextStyle;
  default: ViewStyle;
  defaultText: TextStyle;
  secondary: ViewStyle;
  secondaryText: TextStyle;
  destructive: ViewStyle;
  destructiveText: TextStyle;
  outline: ViewStyle;
  outlineText: TextStyle;
}>({
  base: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 6, // rounded-md
    borderWidth: 1,
    paddingHorizontal: 10, // px-2.5
    paddingVertical: 2, // py-0.5
  },
  textBase: {
    fontSize: 12, // text-xs
    fontWeight: "600", // font-semibold
  },

  // default variant: bg-primary, text-primary-foreground
  default: {
    backgroundColor: "#b19cd9",
    borderColor: "transparent",
  },
  defaultText: {
    color: "#ffffff",
  },

  // secondary variant: bg-secondary, text-secondary-foreground
  secondary: {
    backgroundColor: "#f8f6ff",
    borderColor: "transparent",
  },
  secondaryText: {
    color: "#8b7aa8",
  },

  // destructive variant
  destructive: {
    backgroundColor: "#e11d48",
    borderColor: "transparent",
  },
  destructiveText: {
    color: "#ffffff",
  },

  // outline variant
  outline: {
    backgroundColor: "transparent",
    borderColor: "#4b5563",
  },
  outlineText: {
    color: "#4b5563",
  },
});
