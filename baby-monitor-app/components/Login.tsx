// components/Login.tsx

import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Platform,
} from "react-native";

interface LoginProps {
  onLogin: (userInfo: { name: string; email: string; avatar: string }) => void;
}

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  //  딥링크로 돌아왔을 때 URL에서 token / name 읽어서 로그인 처리
  useEffect(() => {
    const handleUrl = (url: string | null) => {
      if (!url) return;

      // 예: myapp://login-callback?token=...&name=...
      let query = "";
      const questionIndex = url.indexOf("?");
      if (questionIndex >= 0) {
        query = url.slice(questionIndex + 1);
      }

      if (!query) return;

      const params = new URLSearchParams(query);
      const token = params.get("token");
      const name = params.get("name");

      if (token && name) {
        // TODO: RN에서는 AsyncStorage 등에 토큰 저장하면 됨
        // 예: await AsyncStorage.setItem("authToken", token);

        onLogin({
          name,
          email: "",   // 딥링크로는 받지 않음
          avatar: "",  // 딥링크로는 받지 않음
        });
      }
    };

    // 앱이 처음 열릴 때 딥링크로 시작한 경우
    Linking.getInitialURL().then(handleUrl).catch(() => {});

    // 앱이 켜진 상태에서 브라우저 → 앱으로 돌아올 때
    const sub = Linking.addEventListener("url", (event) => {
      handleUrl(event.url);
    });

    return () => {
      sub.remove();
    };
  }, [onLogin]);

  // 구글 로그인 버튼 클릭 → 백엔드 /auth/google 로 딥링크 로그인 시작
  const handleGoogleLogin = () => {
    const url = `${API_BASE_URL}/auth/google`;
    Linking.openURL(url);
  };

  return (
    <View style={styles.root}>
      <View style={styles.inner}>
        {/* 기능 소개 카드 3개 */}
        <View style={styles.featureList}>
          <View style={styles.card}>
            <View style={styles.cardRow}>
              <View style={[styles.iconBox, styles.iconBoxPurple]}>
                <Text style={styles.iconEmoji}>👀</Text>
              </View>
              <View style={styles.cardTextWrapper}>
                <Text style={styles.cardTitle}>실시간 낙상 감지</Text>
                <Text style={styles.cardSubtitle}>
                  24시간 지능형 위험 감지 시스템
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.cardRow}>
              <View style={[styles.iconBox, styles.iconBoxViolet]}>
                <Text style={styles.iconEmoji}>🛡️</Text>
              </View>
              <View style={styles.cardTextWrapper}>
                <Text style={styles.cardTitle}>안전 알림</Text>
                <Text style={styles.cardSubtitle}>
                  즉시 알림으로 위험 상황 대응
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.cardRow}>
              <View style={[styles.iconBox, styles.iconBoxIndigo]}>
                <Text style={styles.iconEmoji}>📊</Text>
              </View>
              <View style={styles.cardTextWrapper}>
                <Text style={styles.cardTitle}>상세 분석</Text>
                <Text style={styles.cardSubtitle}>
                  수면 패턴 분석 및 개선 제안
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* 로그인 카드 */}
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.googleButton}
            onPress={handleGoogleLogin}
            activeOpacity={0.8}
          >
            <View style={styles.googleIconCircle}>
              <Text style={styles.googleIconText}>G</Text>
            </View>
            <Text style={styles.googleButtonText}>Google로 시작하기</Text>
          </TouchableOpacity>

          <Text style={styles.termsText}>
            로그인하시면 서비스 이용약관 및 개인정보처리방침에 동의한 것으로
            간주됩니다.
          </Text>
        </View>

        {/* 보안 안내 */}
        <View style={styles.securityWrapper}>
          <Text style={styles.securityText}>
            🔒 모든 데이터는 안전하게 암호화되어 보관됩니다
          </Text>
        </View>
      </View>
    </View>
  );
};

export default Login;

// ===== 스타일 =====

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#f5f3ff",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
  },
  inner: {
    width: 360,
    maxWidth: "100%",
    gap: 12,
  },
  featureList: {
    gap: 8,
  },
  card: {
    borderRadius: 16,
    padding: 12,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
      },
      android: {
        elevation: 2,
      },
    }),
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  iconBoxPurple: {
    backgroundColor: "#f3e8ff",
  },
  iconBoxViolet: {
    backgroundColor: "#ede9fe",
  },
  iconBoxIndigo: {
    backgroundColor: "#e0f2fe",
  },
  iconEmoji: {
    fontSize: 18,
  },
  cardTextWrapper: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 11,
    color: "#6b7280",
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#d1d5db",
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "#ffffff",
  },
  googleIconCircle: {
    width: 22,
    height: 22,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#9ca3af",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  googleIconText: {
    fontWeight: "700",
    fontSize: 12,
    color: "#2563eb",
  },
  googleButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
  },
  termsText: {
    marginTop: 8,
    fontSize: 11,
    color: "#6b7280",
    textAlign: "center",
  },
  securityWrapper: {
    alignItems: "center",
  },
  securityText: {
    fontSize: 11,
    color: "#6b7280",
    textAlign: "center",
  },
});
