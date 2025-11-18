// app/components/ui/button.tsx (React Native 버전)

import React, { forwardRef, ReactNode } from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
} from "react-native";

type ButtonVariant =
  | "default"
  | "destructive"
  | "outline"
  | "secondary"
  | "ghost"
  | "link";

type ButtonSize = "default" | "sm" | "lg" | "icon";

export interface ButtonProps extends TouchableOpacityProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children?: ReactNode;
  textStyle?: TextStyle;
}

export const Button = forwardRef<any, ButtonProps>(
  (
    {
      variant = "default",
      size = "default",
      children,
      style,
      textStyle,
      disabled,
      ...rest
    },
    ref,
  ) => {
    // View 스타일: 배열로 넘기면 StyleProp<ViewStyle>로 자동 추론됨
    const containerStyles = [
      styles.base,
      styles[`variant_${variant}`],
      styles[`size_${size}`],
      disabled && styles.disabled,
      style,
    ];

    // Text 스타일: textStyle이 optional이라 그냥 배열에 넣어도 OK
    const textStyles = [
      styles.textBase,
      styles[`text_${variant}`],
      textStyle,
    ];

    return (
      <TouchableOpacity
        ref={ref}
        style={containerStyles}
        disabled={disabled}
        activeOpacity={0.7}
        {...rest}
      >
        {typeof children === "string" ? (
          <Text style={textStyles}>{children}</Text>
        ) : (
          children
        )}
      </TouchableOpacity>
    );
  },
);

Button.displayName = "Button";

const styles = StyleSheet.create<{
  base: ViewStyle;
  textBase: TextStyle;
  disabled: ViewStyle;

  variant_default: ViewStyle;
  text_default: TextStyle;

  variant_destructive: ViewStyle;
  text_destructive: TextStyle;

  variant_outline: ViewStyle;
  text_outline: TextStyle;

  variant_secondary: ViewStyle;
  text_secondary: TextStyle;

  variant_ghost: ViewStyle;
  text_ghost: TextStyle;

  variant_link: ViewStyle;
  text_link: TextStyle;

  size_default: ViewStyle;
  size_sm: ViewStyle;
  size_lg: ViewStyle;
  size_icon: ViewStyle;
}>({
  base: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    // gap: 8, // RN 타입에서 오류 나면 이 줄은 잠깐 주석 처리해도 됨
    borderRadius: 8,
  },

  textBase: {
    fontSize: 14,
    fontWeight: "500",
  },

  disabled: {
    opacity: 0.5,
  },

  // ===== variant 스타일 =====

  variant_default: {
    backgroundColor: "#b19cd9",
    borderWidth: 0,
  },
  text_default: {
    color: "#ffffff",
  },

  variant_destructive: {
    backgroundColor: "#e11d48",
    borderWidth: 0,
  },
  text_destructive: {
    color: "#ffffff",
  },

  variant_outline: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#d1d5db",
  },
  text_outline: {
    color: "#111827",
  },

  variant_secondary: {
    backgroundColor: "#f8f6ff",
    borderWidth: 0,
  },
  text_secondary: {
    color: "#4b5563",
  },

  variant_ghost: {
    backgroundColor: "transparent",
    borderWidth: 0,
  },
  text_ghost: {
    color: "#111827",
  },

  variant_link: {
    backgroundColor: "transparent",
    borderWidth: 0,
  },
  text_link: {
    color: "#b19cd9",
    textDecorationLine: "underline",
  },

  // ===== size 스타일 =====

  size_default: {
    height: 36,
    paddingHorizontal: 16,
  },
  size_sm: {
    height: 32,
    paddingHorizontal: 12,
  },
  size_lg: {
    height: 40,
    paddingHorizontal: 24,
  },
  size_icon: {
    width: 36,
    height: 36,
    paddingHorizontal: 0,
  },
});
