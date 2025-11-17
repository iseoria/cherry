// src/components/Settings.tsx
import React, { useState } from 'react'
import { Card } from './ui/card'
import { Switch } from './ui/switch'
import { Button } from './ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Label } from './ui/label'
import { Slider } from './ui/slider'
import { Bell, Shield, LogOut, AlertTriangle, User, Baby, ChevronRight } from 'lucide-react'
import { Separator } from './ui/separator'

interface SettingsProps {
  onClearData: () => void
  onLogout: () => void
  userInfo: { name: string; email: string; avatar: string }
  onOpenProfile: () => void
  babyInfo?: { name: string; gender: 'male' | 'female' | ''; birthDate: string }
}

type DangerZoneSettings = { x: number; y: number; width: number; height: number }
type DetectionSettings = {
  fallDetection: boolean
  abnormalMovement: boolean
  facePosition: boolean
  soundAnalysis: boolean
}

export default function Settings({
  onClearData,
  onLogout,
  userInfo,
  onOpenProfile,
  babyInfo,
}: SettingsProps) {
  const [dangerZoneSettings, setDangerZoneSettings] = useState<DangerZoneSettings>({
    x: 10,
    y: 10,
    width: 80,
    height: 80,
  })
  const [detectionSettings, setDetectionSettings] = useState<DetectionSettings>({
    fallDetection: true,
    abnormalMovement: true,
    facePosition: true,
    soundAnalysis: true,
  })

  return (
    <div className="space-y-4">
      {/* 프로필 카드 */}
      <Card className="p-4 cursor-pointer hover:shadow-md transition-shadow" onClick={onOpenProfile}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
              <User className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h3>{userInfo.name}</h3>
              <p className="text-sm text-gray-600">{userInfo.email}</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>

        <Separator className="my-3" />

        <div className="space-y-2">
          <div className="flex items-center mb-2">
            <Baby className="w-4 h-4 mr-2 text-purple-400" />
            <h4 className="text-sm">아기 정보</h4>
          </div>

          {babyInfo && babyInfo.name ? (
            <>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-xs text-gray-600">이름</span>
                <span className="text-sm">{babyInfo.name}</span>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-xs text-gray-600">성별</span>
                <span className="text-sm">{babyInfo.gender === 'male' ? '남아' : '여아'}</span>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-xs text-gray-600">생년월일</span>
                <span className="text-sm">{babyInfo.birthDate}</span>
              </div>
            </>
          ) : (
            <div className="py-2 text-center">
              <p className="text-xs text-gray-500">아기 정보를 입력해주세요</p>
              <p className="text-xs text-purple-400 mt-1">👆 프로필 클릭하여 등록</p>
            </div>
          )}
        </div>
      </Card>

      {/* 알림 설정 */}
      <Card className="p-4">
        <div className="flex items-center mb-4">
          <Bell className="w-5 h-5 mr-2 text-gray-600" />
          <h2>알림 설정</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>수면 시작 알림</Label>
              <p className="text-sm text-gray-500">정해진 시간에 수면 알림을 받습니다</p>
            </div>
            <Switch /* 타입 선언 필요 시: onCheckedChange?: (checked: boolean) => void */
              onCheckedChange={(checked: boolean) => {
                /* 상태 저장 또는 API 호출 */
              }}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label>수면 종료 알림</Label>
              <p className="text-sm text-gray-500">너무 오래 잤을 때 알림을 받습니다</p>
            </div>
            <Switch
              onCheckedChange={(checked: boolean) => {
                /* 상태 저장 */
              }}
            />
          </div>

          <Separator />

          <div>
            <Label>알림 시간 설정</Label>
            <div className="grid grid-cols-2 gap-3 mt-2">
              <div>
                <Label className="text-sm">수면 시작</Label>
                <input type="time" defaultValue="21:00" className="w-full p-2 mt-1 border rounded-md bg-input-background" />
              </div>
              <div>
                <Label className="text-sm">최대 수면 시간</Label>
                <Select defaultValue="3h">
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2h">2시간</SelectItem>
                    <SelectItem value="3h">3시간</SelectItem>
                    <SelectItem value="4h">4시간</SelectItem>
                    <SelectItem value="5h">5시간</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* 감지 설정 */}
      <Card className="p-4">
        <div className="flex items-center mb-4">
          <AlertTriangle className="w-5 h-5 mr-2 text-gray-600" />
          <h2>감지 설정</h2>
        </div>

        <div className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>낙상 감지</Label>
              <Switch
                checked={detectionSettings.fallDetection}
                onCheckedChange={(checked: boolean) =>
                  setDetectionSettings((prev) => ({ ...prev, fallDetection: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>이상 움직임 감지</Label>
              <Switch
                checked={detectionSettings.abnormalMovement}
                onCheckedChange={(checked: boolean) =>
                  setDetectionSettings((prev) => ({ ...prev, abnormalMovement: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>얼굴 위치 추적</Label>
              <Switch
                checked={detectionSettings.facePosition}
                onCheckedChange={(checked: boolean) =>
                  setDetectionSettings((prev) => ({ ...prev, facePosition: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>소음 분석</Label>
              <Switch
                checked={detectionSettings.soundAnalysis}
                onCheckedChange={(checked: boolean) =>
                  setDetectionSettings((prev) => ({ ...prev, soundAnalysis: checked }))
                }
              />
            </div>
          </div>

          <Separator />

          <div>
            <Label>위험 감지 영역 설정</Label>
            <p className="text-sm text-gray-500 mb-3">침대 영역을 설정하여 정확한 모니터링을 활성화합니다</p>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-sm">X 위치: {dangerZoneSettings.x}%</Label>
                <Slider
                  value={[dangerZoneSettings.x]}
                  onValueChange={([value]: number[]) =>
                    setDangerZoneSettings((prev) => ({ ...prev, x: value }))
                  }
                  max={90}
                  min={0}
                  step={5}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-sm">Y 위치: {dangerZoneSettings.y}%</Label>
                <Slider
                  value={[dangerZoneSettings.y]}
                  onValueChange={([value]: number[]) =>
                    setDangerZoneSettings((prev) => ({ ...prev, y: value }))
                  }
                  max={90}
                  min={0}
                  step={5}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-sm">폭: {dangerZoneSettings.width}%</Label>
                <Slider
                  value={[dangerZoneSettings.width]}
                  onValueChange={([value]: number[]) =>
                    setDangerZoneSettings((prev) => ({ ...prev, width: value }))
                  }
                  max={100}
                  min={10}
                  step={5}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-sm">높이: {dangerZoneSettings.height}%</Label>
                <Slider
                  value={[dangerZoneSettings.height]}
                  onValueChange={([value]: number[]) =>
                    setDangerZoneSettings((prev) => ({ ...prev, height: value }))
                  }
                  max={100}
                  min={10}
                  step={5}
                  className="mt-1"
                />
              </div>
            </div>

            <Button variant="outline" className="w-full mt-3">
              <Shield className="w-4 h-4 mr-2" />
              위험 영역 미리보기
            </Button>
          </div>
        </div>
      </Card>

      {/* 로그아웃 버튼 */}
      <Button variant="outline" className="w-full" onClick={onLogout}>
        <LogOut className="w-4 h-4 mr-2" />
        로그아웃
      </Button>
    </div>
  )
}
