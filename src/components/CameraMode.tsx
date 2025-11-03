import React from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Camera, ArrowLeft } from 'lucide-react';

interface CameraModeProps {
  onBack: () => void;
}

export function CameraMode({ onBack }: CameraModeProps) {
  return (
    <div className="bg-gradient-to-br from-white via-purple-50 to-violet-100 flex flex-col p-4 mx-auto" style={{ width: '412px', height: '917px' }}>
      <div className="mb-4">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="flex items-center"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          뒤로가기
        </Button>
      </div>
      
      <div className="flex-1 flex items-center justify-center">
        <Card className="p-8 max-w-md w-full">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-purple-100 rounded-full flex items-center justify-center">
              <Camera className="w-12 h-12 text-purple-400" />
            </div>
            <h2 className="mb-4">카메라 모드</h2>
            <p className="text-gray-600">
              카메라 기능은 현재 개발 중입니다.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
