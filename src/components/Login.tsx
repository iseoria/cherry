import React from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Eye, Shield, BarChart3 } from "lucide-react";

interface LoginProps {
  onLogin: (userInfo: { name: string; email: string; avatar: string }) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const handleGoogleLogin = () => {
    const mockUser = {
      name: "김부모",
      email: "parent@gmail.com",
      avatar: "/avatar.svg",
    };
    onLogin(mockUser);
  };

  return (
    <div
      className="bg-gradient-to-br from-white via-purple-50 to-violet-100 flex items-center justify-center p-3 mx-auto"
      style={{ width: 412, height: 917 }}
    >
      <div className="max-w-sm w-full space-y-4">
        {/* 기능 소개 */}
        <div className="space-y-3">
          <Card className="p-3 bg-white/70 backdrop-blur">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
                <Eye className="w-4 h-4 text-purple-400" />
              </div>
              <div>
                <h3 className="text-sm">실시간 낙상 감지</h3>
                <p className="text-xs text-gray-600">24시간 지능형 위험 감지 시스템</p>
              </div>
            </div>
          </Card>

          <Card className="p-3 bg-white/70 backdrop-blur">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 bg-violet-100 rounded-lg flex items-center justify-center shrink-0">
                <Shield className="w-4 h-4 text-violet-400" />
              </div>
              <div>
                <h3 className="text-sm">안전 알림</h3>
                <p className="text-xs text-gray-600">즉시 알림으로 위험 상황 대응</p>
              </div>
            </div>
          </Card>

          <Card className="p-3 bg-white/70 backdrop-blur">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 bg-indigo-100 rounded-lg flex items-center justify-center shrink-0">
                <BarChart3 className="w-4 h-4 text-indigo-400" />
              </div>
              <div>
                <h3 className="text-sm">상세 분석</h3>
                <p className="text-xs text-gray-600">수면 패턴 분석 및 개선 제안</p>
              </div>
            </div>
          </Card>
        </div>

        {/* 로그인 버튼 */}
        <Card className="p-5">
          <Button
            onClick={handleGoogleLogin}
            className="w-full h-11 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 gap-2"
          >
            {/* 아이콘은 작은 SVG로! */}
            <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google로 시작하기
          </Button>

          <p className="text-xs text-center text-gray-500 mt-3">
            로그인하시면 서비스 이용약관 및 개인정보처리방침에 동의한 것으로 간주됩니다.
          </p>
        </Card>

        {/* 보안 안내 */}
        <div className="text-center">
          <p className="text-xs text-gray-500">🔒 모든 데이터는 안전하게 암호화되어 보관됩니다</p>
        </div>
      </div>
    </div>
  );
}
