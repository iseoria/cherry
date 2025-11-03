import React from 'react';
import { Camera, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';

interface CameraViewProps {
  onBack: () => void;
}

export function CameraView({ onBack }: CameraViewProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-violet-50">
      <div className="max-w-md mx-auto min-h-screen bg-white shadow-xl">
        {/* 헤더 */}
        <div className="bg-gradient-to-r from-purple-200 to-violet-300 text-purple-600 p-6 rounded-b-3xl">
          <div className="flex items-center justify-between mb-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onBack}
              className="text-purple-600 hover:bg-purple-100"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl">카메라 모드</h1>
            <div className="w-9"></div>
          </div>
          <p className="text-center text-purple-500">영상 전송 대기 중</p>
        </div>

        {/* 빈 화면 */}
        <div className="flex items-center justify-center h-[calc(100vh-120px)] p-6">
          <div className="text-center">
            <Camera className="w-24 h-24 mx-auto mb-6 text-purple-200" />
            <h2 className="mb-2 text-gray-400">카메라 연결 대기 중</h2>
            <p className="text-sm text-gray-400">카메라 설정이 완료되면 이곳에 표시됩니다</p>
          </div>
        </div>
      </div>
    </div>
  );
}
