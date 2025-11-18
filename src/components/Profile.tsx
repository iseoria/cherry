import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { User, Baby, ArrowLeft, Save } from 'lucide-react';
import { toast } from "sonner";

interface ProfileProps {
  onBack: () => void;
  userInfo: {name: string, email: string, avatar: string};
  babyInfo?: {name: string, gender: 'male' | 'female' | '', birthDate: string};
  onUpdateBabyInfo: (info: {name: string, gender: 'male' | 'female' | '', birthDate: string}) => void;
}

export default function Profile({ onBack, userInfo, babyInfo, onUpdateBabyInfo }: ProfileProps) {
  const [babyName, setBabyName] = useState(babyInfo?.name || '');
  const [babyGender, setBabyGender] = useState<'male' | 'female' | ''>(babyInfo?.gender || '');
  const [babyBirthDate, setBabyBirthDate] = useState(babyInfo?.birthDate || '');

  const handleSave = () => {
    if (!babyName || !babyGender || !babyBirthDate) {
      toast.error('모든 정보를 입력해주세요');
      return;
    }
    
    onUpdateBabyInfo({
      name: babyName,
      gender: babyGender,
      birthDate: babyBirthDate
    });
    
    toast.success('프로필이 저장되었습니다');
    onBack();
  };

  return (
    <div className="space-y-4">
      {/* 헤더 */}
      <div className="flex items-center mb-2">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={onBack}
          className="mr-2"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h2>프로필</h2>
      </div>

      {/* 부모 프로필 */}
      <Card className="p-4">
        <div className="flex items-center mb-3">
          <User className="w-5 h-5 mr-2 text-purple-400" />
          <h3>부모 정보</h3>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center">
            <User className="w-7 h-7 text-purple-400" />
          </div>
          <div>
            <p className="mb-1">{userInfo.name}</p>
            <p className="text-sm text-gray-600">{userInfo.email}</p>
          </div>
        </div>
      </Card>

      {/* 아기 프로필 */}
      <Card className="p-4">
        <div className="flex items-center mb-3">
          <Baby className="w-5 h-5 mr-2 text-purple-400" />
          <h3>아기 정보</h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="baby-name">아기 이름</Label>
            <Input
              id="baby-name"
              placeholder="이름을 입력하세요"
              value={babyName}
              onChange={(e) => setBabyName(e.target.value)}
              className="mt-1.5"
            />
          </div>

          <div>
            <Label htmlFor="baby-gender">성별</Label>
            <Select value={babyGender} onValueChange={(value: 'male' | 'female') => setBabyGender(value)}>
              <SelectTrigger id="baby-gender" className="mt-1.5">
                <SelectValue placeholder="성별을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">남아</SelectItem>
                <SelectItem value="female">여아</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="baby-birthdate">생년월일</Label>
            <div className="grid grid-cols-3 gap-2 mt-1.5">
              <Input
                id="baby-birthdate-year"
                type="number"
                placeholder="년 (YYYY)"
                value={babyBirthDate.split('-')[0] || ''}
                onChange={(e) => {
                  const parts = babyBirthDate.split('-');
                  const newDate = `${e.target.value}-${parts[1] || ''}-${parts[2] || ''}`;
                  setBabyBirthDate(newDate);
                }}
                min="2020"
                max="2025"
              />
              <Input
                id="baby-birthdate-month"
                type="number"
                placeholder="월 (MM)"
                value={babyBirthDate.split('-')[1] || ''}
                onChange={(e) => {
                  const parts = babyBirthDate.split('-');
                  const newDate = `${parts[0] || ''}-${e.target.value}-${parts[2] || ''}`;
                  setBabyBirthDate(newDate);
                }}
                min="1"
                max="12"
              />
              <Input
                id="baby-birthdate-day"
                type="number"
                placeholder="일 (DD)"
                value={babyBirthDate.split('-')[2] || ''}
                onChange={(e) => {
                  const parts = babyBirthDate.split('-');
                  const newDate = `${parts[0] || ''}-${parts[1] || ''}-${e.target.value}`;
                  setBabyBirthDate(newDate);
                }}
                min="1"
                max="31"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* 저장 버튼 */}
      <Button 
        onClick={handleSave}
        className="w-full bg-purple-500 hover:bg-purple-600"
      >
        <Save className="w-4 h-4 mr-2" />
        저장
      </Button>

      {/* 아기 프로필 미리보기 (저장된 경우에만 표시) */}
      {babyInfo && babyInfo.name && (
        <Card className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <div className="flex items-center mb-2">
            <Baby className="w-5 h-5 mr-2 text-purple-400" />
            <h4 className="text-purple-600">현재 프로필</h4>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-200 to-pink-200 flex items-center justify-center">
              <Baby className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <p className="mb-0.5">{babyInfo.name}</p>
              <p className="text-sm text-purple-600">
                {babyInfo.gender === 'male' ? '남아' : '여아'} · {babyInfo.birthDate}
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
