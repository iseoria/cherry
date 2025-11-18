// src/components/Settings.tsx (React Native 버전)

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';

import { Card } from './ui/card';
import { Switch } from './ui/switch';
import { Button } from './ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { Separator } from './ui/separator';

// RN에서는 lucide-react-native 사용
import {
  Bell,
  Shield,
  LogOut,
  AlertTriangle,
  User,
  Baby,
  ChevronRight,
} from 'lucide-react-native';

interface SettingsProps {
  onClearData: () => void;
  onLogout: () => void;
  userInfo: { name: string; email: string; avatar: string };
  onOpenProfile: () => void;
  babyInfo?: { name: string; gender: 'male' | 'female' | ''; birthDate: string };
}

type DangerZoneSettings = { x: number; y: number; width: number; height: number };
type DetectionSettings = {
  fallDetection: boolean;
  abnormalMovement: boolean;
  facePosition: boolean;
  soundAnalysis: boolean;
};

export default function Settings({
  onClearData,
  onLogout,
  userInfo,
  onOpenProfile,
  babyInfo,
}: SettingsProps) {
  const [dangerZoneSettings, setDangerZoneSettings] =
    useState<DangerZoneSettings>({
      x: 10,
      y: 10,
      width: 80,
      height: 80,
    });

  const [detectionSettings, setDetectionSettings] =
    useState<DetectionSettings>({
      fallDetection: true,
      abnormalMovement: true,
      facePosition: true,
      soundAnalysis: true,
    });

  const [sleepStartTime, setSleepStartTime] = useState('21:00');

  return (
    <View style={styles.container}>
      {/* 프로필 카드 */}
      <TouchableOpacity
        onPress={onOpenProfile}
        activeOpacity={0.8}
      >
        <Card style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.profileLeft}>
              <View style={styles.avatarCircle}>
                <User size={24} color="#c4b5fd" />
              </View>
              <View>
                <Text style={styles.profileName}>{userInfo.name}</Text>
                <Text style={styles.profileEmail}>{userInfo.email}</Text>
              </View>
            </View>
            <ChevronRight size={20} color="#9ca3af" />
          </View>

          <Separator style={styles.profileSeparator} />

          <View>
            <View style={styles.babyHeader}>
              <Baby size={16} color="#a855f7" style={{ marginRight: 6 }} />
              <Text style={styles.babyHeaderText}>아기 정보</Text>
            </View>

            {babyInfo && babyInfo.name ? (
              <>
                <View style={styles.babyRow}>
                  <Text style={styles.babyLabel}>이름</Text>
                  <Text style={styles.babyValue}>{babyInfo.name}</Text>
                </View>
                <View style={styles.babyRow}>
                  <Text style={styles.babyLabel}>성별</Text>
                  <Text style={styles.babyValue}>
                    {babyInfo.gender === 'male' ? '남아' : '여아'}
                  </Text>
                </View>
                <View style={styles.babyRow}>
                  <Text style={styles.babyLabel}>생년월일</Text>
                  <Text style={styles.babyValue}>{babyInfo.birthDate}</Text>
                </View>
              </>
            ) : (
              <View style={styles.babyEmpty}>
                <Text style={styles.babyEmptyText}>아기 정보를 입력해주세요</Text>
                <Text style={styles.babyEmptyHint}>👆 프로필 클릭하여 등록</Text>
              </View>
            )}
          </View>
        </Card>
      </TouchableOpacity>

      {/* 알림 설정 */}
      <Card style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Bell size={20} color="#4b5563" style={{ marginRight: 8 }} />
          <Text style={styles.sectionTitle}>알림 설정</Text>
        </View>

        <View style={styles.sectionBody}>
          <View style={styles.rowBetween}>
            <View style={styles.rowTextBlock}>
              <Label>수면 시작 알림</Label>
              <Text style={styles.descriptionText}>
                정해진 시간에 수면 알림을 받습니다
              </Text>
            </View>
            <Switch
              onCheckedChange={(checked: boolean) => {
                // TODO: 상태 저장 또는 API 호출
              }}
            />
          </View>

          <Separator style={styles.separator} />

          <View style={styles.rowBetween}>
            <View style={styles.rowTextBlock}>
              <Label>수면 종료 알림</Label>
              <Text style={styles.descriptionText}>
                너무 오래 잤을 때 알림을 받습니다
              </Text>
            </View>
            <Switch
              onCheckedChange={(checked: boolean) => {
                // TODO: 상태 저장
              }}
            />
          </View>

          <Separator style={styles.separator} />

          <View>
            <Label>알림 시간 설정</Label>
            <View style={styles.timeGrid}>
              <View style={styles.timeColumn}>
                <Label style={styles.smallLabel}>수면 시작</Label>
                <TextInput
                  value={sleepStartTime}
                  onChangeText={setSleepStartTime}
                  placeholder="21:00"
                  style={styles.timeInput}
                />
              </View>
              <View style={styles.timeColumn}>
                <Label style={styles.smallLabel}>최대 수면 시간</Label>
                <Select defaultValue="3h">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2h">2시간</SelectItem>
                    <SelectItem value="3h">3시간</SelectItem>
                    <SelectItem value="4h">4시간</SelectItem>
                    <SelectItem value="5h">5시간</SelectItem>
                  </SelectContent>
                </Select>
              </View>
            </View>
          </View>
        </View>
      </Card>

      {/* 감지 설정 */}
      <Card style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <AlertTriangle size={20} color="#4b5563" style={{ marginRight: 8 }} />
          <Text style={styles.sectionTitle}>감지 설정</Text>
        </View>

        <View style={styles.sectionBody}>
          <View style={styles.switchGroup}>
            <View style={styles.rowBetween}>
              <Label>낙상 감지</Label>
              <Switch
                checked={detectionSettings.fallDetection}
                onCheckedChange={(checked: boolean) =>
                  setDetectionSettings((prev) => ({
                    ...prev,
                    fallDetection: checked,
                  }))
                }
              />
            </View>

            <View style={styles.rowBetween}>
              <Label>이상 움직임 감지</Label>
              <Switch
                checked={detectionSettings.abnormalMovement}
                onCheckedChange={(checked: boolean) =>
                  setDetectionSettings((prev) => ({
                    ...prev,
                    abnormalMovement: checked,
                  }))
                }
              />
            </View>

            <View style={styles.rowBetween}>
              <Label>얼굴 위치 추적</Label>
              <Switch
                checked={detectionSettings.facePosition}
                onCheckedChange={(checked: boolean) =>
                  setDetectionSettings((prev) => ({
                    ...prev,
                    facePosition: checked,
                  }))
                }
              />
            </View>

            <View style={styles.rowBetween}>
              <Label>소음 분석</Label>
              <Switch
                checked={detectionSettings.soundAnalysis}
                onCheckedChange={(checked: boolean) =>
                  setDetectionSettings((prev) => ({
                    ...prev,
                    soundAnalysis: checked,
                  }))
                }
              />
            </View>
          </View>

          <Separator style={styles.separator} />

          <View>
            <Label>위험 감지 영역 설정</Label>
            <Text style={styles.descriptionText}>
              침대 영역을 설정하여 정확한 모니터링을 활성화합니다
            </Text>

            <View style={styles.sliderGrid}>
              <View style={styles.sliderColumn}>
                <Label style={styles.smallLabel}>
                  X 위치: {dangerZoneSettings.x}%
                </Label>
                <Slider
                  value={[dangerZoneSettings.x]}
                  onValueChange={([value]: number[]) =>
                    setDangerZoneSettings((prev) => ({ ...prev, x: value }))
                  }
                  max={90}
                  min={0}
                  step={5}
                />
              </View>

              <View style={styles.sliderColumn}>
                <Label style={styles.smallLabel}>
                  Y 위치: {dangerZoneSettings.y}%
                </Label>
                <Slider
                  value={[dangerZoneSettings.y]}
                  onValueChange={([value]: number[]) =>
                    setDangerZoneSettings((prev) => ({ ...prev, y: value }))
                  }
                  max={90}
                  min={0}
                  step={5}
                />
              </View>

              <View style={styles.sliderColumn}>
                <Label style={styles.smallLabel}>
                  폭: {dangerZoneSettings.width}%
                </Label>
                <Slider
                  value={[dangerZoneSettings.width]}
                  onValueChange={([value]: number[]) =>
                    setDangerZoneSettings((prev) => ({ ...prev, width: value }))
                  }
                  max={100}
                  min={10}
                  step={5}
                />
              </View>

              <View style={styles.sliderColumn}>
                <Label style={styles.smallLabel}>
                  높이: {dangerZoneSettings.height}%
                </Label>
                <Slider
                  value={[dangerZoneSettings.height]}
                  onValueChange={([value]: number[]) =>
                    setDangerZoneSettings((prev) => ({
                      ...prev,
                      height: value,
                    }))
                  }
                  max={100}
                  min={10}
                  step={5}
                />
              </View>
            </View>

            <Button
              variant="outline"
              style={styles.previewButton}
              onPress={() => {
                // TODO: 위험 영역 미리보기 버튼 로직
              }}
            >
              <Shield size={16} color="#4b5563" style={{ marginRight: 6 }} />
              <Text>위험 영역 미리보기</Text>
            </Button>
          </View>
        </View>
      </Card>

      {/* 로그아웃 버튼 */}
      <Button
        variant="outline"
        style={styles.logoutButton}
        onPress={onLogout}
      >
        <LogOut size={16} color="#4b5563" style={{ marginRight: 6 }} />
        <Text>로그아웃</Text>
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },

  /* 프로필 카드 */
  profileCard: {
    padding: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  profileLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ede9fe', // purple-100
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  profileName: {
    fontSize: 16,
    fontWeight: '600',
  },
  profileEmail: {
    fontSize: 13,
    color: '#4b5563',
    marginTop: 2,
  },
  profileSeparator: {
    marginVertical: 12,
  },
  babyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  babyHeaderText: {
    fontSize: 13,
    fontWeight: '500',
  },
  babyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  babyLabel: {
    fontSize: 11,
    color: '#6b7280',
  },
  babyValue: {
    fontSize: 13,
  },
  babyEmpty: {
    paddingVertical: 8,
    alignItems: 'center',
  },
  babyEmptyText: {
    fontSize: 11,
    color: '#6b7280',
  },
  babyEmptyHint: {
    fontSize: 11,
    color: '#a855f7',
    marginTop: 4,
  },

  /* 공통 섹션 카드 */
  sectionCard: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  sectionBody: {
    gap: 8,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowTextBlock: {
    flex: 1,
    marginRight: 12,
  },
  descriptionText: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  separator: {
    marginVertical: 8,
  },

  /* 알림 시간 설정 */
  timeGrid: {
    flexDirection: 'row',
    marginTop: 8,
  },
  timeColumn: {
    flex: 1,
    marginRight: 8,
  },
  smallLabel: {
    fontSize: 12,
  } as any,
  timeInput: {
    marginTop: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
    fontSize: 13,
    color: '#111827',
  },

  /* 감지 설정 */
  switchGroup: {
    gap: 8,
  },

  sliderGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  sliderColumn: {
    width: '50%',
    paddingRight: 8,
    marginBottom: 8,
  },

  previewButton: {
    marginTop: 12,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* 로그아웃 버튼 */
  logoutButton: {
    marginTop: 8,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
