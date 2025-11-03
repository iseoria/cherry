import React from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Camera, User } from 'lucide-react';

interface RoleSelectionProps {
  onRoleSelect: (role: 'camera' | 'user') => void;
}

export function RoleSelection({ onRoleSelect }: RoleSelectionProps) {
  return (
    <div className="bg-gradient-to-br from-white via-purple-50 to-violet-100 flex items-center justify-center p-3 mx-auto" style={{ width: '412px', height: '917px' }}>
      <div className="max-w-sm w-full space-y-4">
        <div className="text-center mb-6">
          <h1 className="text-gray-900 mb-1">역할 선택</h1>
          <p className="text-sm text-gray-600">접속 유형을 선택해주세요</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Card 
            className="p-4 hover:shadow-lg transition-shadow cursor-pointer border-2 border-purple-200 hover:border-purple-400"
            onClick={() => onRoleSelect('camera')}
          >
            <div className="flex flex-col items-center space-y-3">
              <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center">
                <Camera className="w-7 h-7 text-purple-400" />
              </div>
              <div className="text-center">
                <h3 className="mb-1">카메라</h3>
                <p className="text-xs text-gray-600">
                  모니터링 카메라로 접속합니다
                </p>
              </div>
            </div>
          </Card>

          <Card 
            className="p-4 hover:shadow-lg transition-shadow cursor-pointer border-2 border-violet-200 hover:border-violet-400"
            onClick={() => onRoleSelect('user')}
          >
            <div className="flex flex-col items-center space-y-3">
              <div className="w-14 h-14 bg-violet-100 rounded-full flex items-center justify-center">
                <User className="w-7 h-7 text-violet-400" />
              </div>
              <div className="text-center">
                <h3 className="mb-1">사용자</h3>
                <p className="text-xs text-gray-600">
                  부모/보호자로 접속합니다
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
