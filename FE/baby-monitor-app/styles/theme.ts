// src/styles/theme.ts
// React Native용 테마 + 글로벌 스타일 (index.css 대체)

import { StyleSheet } from "react-native";

export const theme = {
  fontSize: 14,
  maxWidthCompact: 412,

  radius: {
    md: 10, // 0.625rem 근사
  },

  fontWeight: {
    medium: "500" as const,
    normal: "400" as const,
  },

  light: {
    background: "hsl(0 0% 100%)",
    foreground: "hsl(260 13% 30%)",

    card: "hsl(0 0% 100%)",
    cardForeground: "hsl(260 13% 30%)",

    popover: "hsl(0 0% 100%)",
    popoverForeground: "hsl(260 13% 30%)",

    primary: "hsl(265 35% 75%)",
    primaryForeground: "hsl(0 0% 100%)",

    secondary: "hsl(255 100% 97%)",
    secondaryForeground: "hsl(264 18% 57%)",

    muted: "hsl(260 33% 98%)",
    mutedForeground: "hsl(265 15% 60%)",

    accent: "hsl(255 70% 95%)",
    accentForeground: "hsl(264 18% 57%)",

    destructive: "hsl(347 89% 47%)",
    destructiveForeground: "hsl(0 0% 100%)",

    border: "hsla(265, 35%, 75%, 0.35)",
    input: "hsla(265, 35%, 75%, 0.35)",
    ring: "hsl(260 10% 50%)",
  },

  dark: {
    background: "hsl(260 13% 10%)",
    foreground: "hsl(0 0% 100%)",

    card: "hsl(260 13% 14%)",
    cardForeground: "hsl(0 0% 100%)",

    popover: "hsl(260 13% 14%)",
    popoverForeground: "hsl(0 0% 100%)",

    primary: "hsl(265 80% 80%)",
    primaryForeground: "hsl(260 13% 14%)",

    secondary: "hsl(260 20% 20%)",
    secondaryForeground: "hsl(0 0% 100%)",

    muted: "hsl(260 20% 20%)",
    mutedForeground: "hsl(265 20% 70%)",

    accent: "hsl(260 20% 20%)",
    accentForeground: "hsl(0 0% 100%)",

    destructive: "hsl(347 80% 55%)",
    destructiveForeground: "hsl(0 0% 100%)",

    border: "hsla(0, 0%, 100%, 0.1)",
    input: "hsla(0, 0%, 100%, 0.15)",
    ring: "hsl(260 10% 60%)",
  },
};

// 웹의 body/#root 레이아웃을 RN용으로 옮긴 전역 스타일
export const globalStyles = StyleSheet.create({
  // 앱 전체를 감싸는 배경 (웹의 html/body 역할)
  screen: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
  },
  // 412 x 917짜리 "폰 프레임" (웹의 #root 박스)
  appFrame: {
    width: 412,
    height: 917,
    borderRadius: theme.radius.md,
    overflow: "hidden",
    backgroundColor: theme.light.background,
    shadowColor: "#000000",
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
});

// 타이포그래피 프리셋 (h1/h2/h3/p 대응)
export const typography = StyleSheet.create({
  h1: {
    fontSize: 24,
    fontWeight: theme.fontWeight.medium,
    lineHeight: 24 * 1.5,
  },
  h2: {
    fontSize: 20,
    fontWeight: theme.fontWeight.medium,
    lineHeight: 20 * 1.5,
  },
  h3: {
    fontSize: 18,
    fontWeight: theme.fontWeight.medium,
    lineHeight: 18 * 1.5,
  },
  p: {
    fontSize: 16,
    fontWeight: theme.fontWeight.normal,
    lineHeight: 16 * 1.5,
  },
});
