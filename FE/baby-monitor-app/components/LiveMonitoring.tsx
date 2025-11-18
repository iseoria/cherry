// src/components/LiveMonitoring.tsx (React Native 버전)

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { ReactNode } from "react";

import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { ScrollArea } from './ui/scroll-area';
import { Textarea } from './ui/textarea'; // 지금은 안 쓰지만, 나중 메모 편집용으로 남겨둠

// 아이콘은 lucide-react-native 기준
import {
  Bell,
  AlertTriangle,
  Shield,
  Eye,
  Video,
  Play,
  X,
} from 'lucide-react-native';

interface LiveMonitoringProps {
  onEventDetected: (event: string, severity: 'low' | 'medium' | 'high') => void;
  events: Array<{
    id: string;
    type: string;
    severity: 'low' | 'medium' | 'high';
    timestamp: Date;
    memo?: string;
  }>;
  onUpdateEventMemo: (eventId: string, memo: string) => void;
  onDeleteEvent: (eventId: string) => void;
  aiInsightsComponent?: React.ReactNode;
  onOpenMonitoring: () => void;
}

type Severity = 'low' | 'medium' | 'high';

export default function LiveMonitoring({
  onEventDetected,
  events,
  onUpdateEventMemo,
  onDeleteEvent,
  aiInsightsComponent,
  onOpenMonitoring,
}: LiveMonitoringProps) {
  const [currentEvents, setCurrentEvents] = useState<
    Array<{
      id: string;
      type: string;
      timestamp: Date;
      severity: Severity;
    }>
  >([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [memoText, setMemoText] = useState('');
  const [showVideoDialog, setShowVideoDialog] = useState(false);
  const [selectedVideoEvent, setSelectedVideoEvent] = useState<{
    type: string;
    timestamp: Date;
  } | null>(null);

  // 실시간 이벤트 시뮬레이션
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.97) {
        const eventTypes = ['낙상 감지', '뒤척임', '울음소리', '얼굴 가림'];
        const severities: Severity[] = ['low', 'medium', 'high'];
        const eventType =
          eventTypes[Math.floor(Math.random() * eventTypes.length)];
        const severity =
          severities[Math.floor(Math.random() * severities.length)];

        const newEvent = {
          id: Date.now().toString(),
          type: eventType,
          timestamp: new Date(),
          severity,
        };

        setCurrentEvents((prev) => [newEvent, ...prev.slice(0, 9)]);
        onEventDetected(eventType, severity);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [onEventDetected]);

  const getSeverityBadgeStyle = (severity: Severity) => {
    switch (severity) {
      case 'low':
        return {
          container: styles.badgeLow,
          text: styles.badgeLowText,
          label: '낮음',
        };
      case 'medium':
        return {
          container: styles.badgeMedium,
          text: styles.badgeMediumText,
          label: '보통',
        };
      case 'high':
        return {
          container: styles.badgeHigh,
          text: styles.badgeHighText,
          label: '높음',
        };
    }
  };

  const getSeverityIcon = (severity: Severity) => {
    switch (severity) {
      case 'low':
        return <Shield size={16} color="#22c55e" />; // green-500
      case 'medium':
        return <Eye size={16} color="#eab308" />; // yellow-500
      case 'high':
        return <AlertTriangle size={16} color="#ef4444" />; // red-500
    }
  };

  const notificationCountLabel =
    events.length > 9 ? '9+' : events.length.toString();

  return (
    <View style={styles.container}>
      {/* 알림 헤더 */}
      <View style={styles.notificationsHeader}>
        <Dialog open={showNotifications} onOpenChange={setShowNotifications}>
          {/* 트리거 버튼 */}
          <View style={styles.notificationButtonWrapper}>
            <Button
              variant="outline"
              size="sm"
              style={styles.notificationButton}
              onPress={() => setShowNotifications(true)}
            >
              <Bell size={16} color="#a855f7" />
              <Text style={styles.notificationButtonText}>알림</Text>
            </Button>
            {events.length > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>
                  {notificationCountLabel}
                </Text>
              </View>
            )}
          </View>

            <DialogContent>
                <View style={styles.dialogContent}>
                    <DialogHeader>
                        <DialogTitle>
                            <Text style={styles.dialogTitleText}>알림 기록</Text>
                        </DialogTitle>
                        <DialogDescription>
                            <Text style={styles.dialogDescriptionText}>
                             최근 감지된 이벤트 목록을 확인할 수 있습니다.
                            </Text>
                        </DialogDescription>
                    </DialogHeader>

            <ScrollArea style={{ maxHeight: 384 }}>
              {events.length === 0 ? (
                <View style={styles.emptyNotifications}>
                  <Bell size={32} color="#9ca3af" />
                  <Text style={styles.emptyNotificationsTitle}>
                    알림 기록이 없습니다
                  </Text>
                  <Text style={styles.emptyNotificationsSubtitle}>
                    새로 감지되는 이벤트가 여기 표시됩니다.
                  </Text>
                </View>
              ) : (
                <View>
                  {events.slice(0, 20).map((event) => {
                    const severityStyles = getSeverityBadgeStyle(
                      event.severity,
                    );
                    return (
                      <View
                        key={event.id}
                        style={styles.notificationItemContainer}
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          style={styles.notificationDeleteButton}
                          onPress={() => onDeleteEvent(event.id)}
                        >
                          <X size={12} color="#6b7280" />
                        </Button>

                        <View style={styles.notificationItemHeader}>
                          <View style={styles.notificationItemLeft}>
                            {getSeverityIcon(event.severity)}
                            <Text style={styles.notificationItemType}>
                              {event.type}
                            </Text>
                            <Badge
                              style={[
                                styles.badgeBase,
                                severityStyles.container,
                              ]}
                              textStyle={severityStyles.text}
                            >
                              {severityStyles.label}
                            </Badge>
                          </View>
                          <Text style={styles.notificationItemTime}>
                            {event.timestamp.toLocaleDateString('ko-KR', {
                              month: 'short',
                              day: 'numeric',
                            })}{' '}
                            {event.timestamp.toLocaleTimeString('ko-KR', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </Text>
                        </View>

                        <Text style={styles.notificationItemDesc}>
                          {event.type === '낙상 감지' &&
                            '침대에서 떨어질 위험이 감지되었습니다'}
                          {event.type === '뒤척임' &&
                            '수면 중 자세 변화가 감지되었습니다'}
                          {event.type === '울음소리' &&
                            '아기가 울고 있습니다. 확인이 필요합니다'}
                          {event.type === '얼굴 가림' &&
                            '얼굴이 가려져 있습니다. 즉시 확인하세요'}
                          {!['낙상 감지', '뒤척임', '울음소리', '얼굴 가림'].includes(
                            event.type,
                          ) && '이벤트가 감지되었습니다'}
                        </Text>

                        {event.memo && (
                          <Text style={styles.notificationItemMemo}>
                            📝 {event.memo}
                          </Text>
                        )}
                      </View>
                    );
                  })}
                </View>
              )}
            </ScrollArea>
            </View>
          </DialogContent>
        </Dialog>
      </View>

      {/* 실시간 모니터링 버튼 카드 */}
      <Card style={styles.monitoringCard}>
        <View style={styles.monitoringRow}>
          <View style={styles.monitoringLeft}>
            <Video size={20} color="#a855f7" style={{ marginRight: 8 }} />
            <View>
              <Text style={styles.monitoringTitle}>실시간 모니터링</Text>
              <Text style={styles.monitoringSubtitle}>
                카메라 영상을 실시간으로 확인하세요
              </Text>
            </View>
          </View>
          <Button
            onPress={onOpenMonitoring}
            size="sm"
            style={styles.monitoringButton}
          >
            <Play size={14} color="#ffffff" style={{ marginRight: 4 }} />
            <Text style={styles.monitoringButtonText}>시작</Text>
          </Button>
        </View>
      </Card>

      {/* AI 인사이트 */}
      {aiInsightsComponent && <View style={styles.aiInsightsContainer}>{aiInsightsComponent}</View>}

      {/* 실시간 이벤트 카드 */}
      <Card style={styles.realtimeCard}>
        <Text style={styles.realtimeTitle}>실시간 이벤트</Text>

        {currentEvents.length === 0 ? (
          <View style={styles.realtimeEmpty}>
            <Shield size={28} color="#9ca3af" />
            <Text style={styles.realtimeEmptyTitle}>
              현재 감지된 이벤트가 없습니다
            </Text>
            <Text style={styles.realtimeEmptySubtitle}>
              낙상 감지, 뒤척임, 울음소리, 얼굴 가림을 실시간으로 모니터링합니다
            </Text>
          </View>
        ) : (
          <View>
            {currentEvents.map((event) => {
              const fullEvent = events.find((e) => e.id === event.id);
              const severityStyles = getSeverityBadgeStyle(event.severity);

              return (
                <View key={event.id} style={styles.realtimeItem}>
                  <View style={styles.realtimeItemHeader}>
                    <View style={styles.realtimeItemLeft}>
                      {getSeverityIcon(event.severity)}
                      <View>
                        <Text style={styles.realtimeItemType}>
                          {event.type}
                        </Text>
                        <Text style={styles.realtimeItemTime}>
                          {event.timestamp.toLocaleTimeString('ko-KR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.realtimeItemRight}>
                      <Badge
                        style={[styles.badgeBase, severityStyles.container]}
                        textStyle={severityStyles.text}
                      >
                        {severityStyles.label}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        style={styles.realtimePlayButton}
                        onPress={() => {
                          setSelectedVideoEvent({
                            type: event.type,
                            timestamp: event.timestamp,
                          });
                          setShowVideoDialog(true);
                        }}
                      >
                        <Play size={14} color="#a855f7" />
                      </Button>
                    </View>
                  </View>

                  {fullEvent?.memo && (
                    <Text style={styles.realtimeMemo}>📝 {fullEvent.memo}</Text>
                  )}
                </View>
              );
            })}
          </View>
        )}
      </Card>

      {/* 영상 재생 Dialog */}
      <Dialog open={showVideoDialog} onOpenChange={setShowVideoDialog}>
        <DialogContent>
            <View style={styles.dialogContent}>
                <DialogHeader>
                    <DialogTitle>
                        <Text style={styles.dialogTitleText}>이벤트 영상</Text>
                    </DialogTitle>
                    <DialogDescription>
                        <Text style={styles.dialogDescriptionText}>
                        {selectedVideoEvent &&
                        `${selectedVideoEvent.type} - ${selectedVideoEvent.timestamp.toLocaleString(
                         "ko-KR",
                    )}`}
                        </Text>
                    </DialogDescription>
                </DialogHeader>

          <View style={styles.videoDialogBody}>
            <View style={styles.videoPlayerMock}>
              <Video size={48} color="#ffffff" />
              <Text style={styles.videoPlayerText}>영상 재생 중...</Text>
              <Text style={styles.videoPlayerSubText}>
                실제 환경에서 녹화된 영상이 재생됩니다
              </Text>
            </View>
            <View style={styles.videoDialogButtons}>
              <Button
                style={styles.videoDialogConfirmButton}
                onPress={() => setShowVideoDialog(false)}
              >
                <Text style={styles.videoDialogConfirmText}>확인</Text>
              </Button>
            </View>
          </View>
          </View>
        </DialogContent>
      </Dialog>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // 전체 섹션
  },

  /* 알림 헤더 */
  notificationsHeader: {
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  notificationButtonWrapper: {
    position: 'relative',
  },
  notificationButton: {
    backgroundColor: '#f5f3ff', // purple-50
    borderColor: '#e9d5ff', // purple-200
    paddingHorizontal: 10,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationButtonText: {
    marginLeft: 6,
    fontSize: 13,
    color: '#a855f7', // purple-500
  },
  notificationBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#ef4444', // red-500
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationBadgeText: {
    fontSize: 10,
    color: '#ffffff',
    fontWeight: '600',
  },

  dialogContent: {
    maxWidth: 380,
    alignSelf: 'center',
  },
  dialogTitleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#a855f7',
  },
  dialogDescriptionText: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 4,
  },

  emptyNotifications: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  emptyNotificationsTitle: {
    marginTop: 8,
    fontSize: 14,
    color: '#6b7280',
  },
  emptyNotificationsSubtitle: {
    marginTop: 4,
    fontSize: 12,
    color: '#9ca3af',
  },

  notificationItemContainer: {
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e9d5ff', // purple-100
    backgroundColor: '#ffffff',
    marginBottom: 8,
    position: 'relative',
  },
  notificationDeleteButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 24,
    height: 24,
    paddingHorizontal: 0,
    paddingVertical: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
    paddingRight: 20,
  },
  notificationItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },
  notificationItemType: {
    fontSize: 13,
    marginLeft: 6,
    marginRight: 4,
  },
  notificationItemTime: {
    fontSize: 11,
    color: '#6b7280',
  },
  notificationItemDesc: {
    fontSize: 11,
    color: '#4b5563',
    marginLeft: 22,
    marginTop: 2,
  },
  notificationItemMemo: {
    fontSize: 11,
    color: '#6b21a8',
    backgroundColor: '#f5f3ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginLeft: 22,
    marginTop: 4,
  },

  /* Badge 기본 + severity */
  badgeBase: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeLow: {
    backgroundColor: '#dcfce7',
  },
  badgeLowText: {
    color: '#166534',
    fontSize: 11,
  },
  badgeMedium: {
    backgroundColor: '#fef9c3',
  },
  badgeMediumText: {
    color: '#854d0e',
    fontSize: 11,
  },
  badgeHigh: {
    backgroundColor: '#fee2e2',
  },
  badgeHighText: {
    color: '#991b1b',
    fontSize: 11,
  },

  /* 실시간 모니터링 카드 */
  monitoringCard: {
    padding: 12,
    borderColor: '#e9d5ff',
    backgroundColor: '#f5f3ff',
    marginBottom: 12,
  },
  monitoringRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  monitoringLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  monitoringTitle: {
    color: '#7c3aed',
    fontSize: 14,
    fontWeight: '600',
  },
  monitoringSubtitle: {
    fontSize: 11,
    color: '#a855f7',
    marginTop: 2,
  },
  monitoringButton: {
    backgroundColor: '#a855f7',
  },
  monitoringButtonText: {
    color: '#ffffff',
    fontSize: 13,
  },

  aiInsightsContainer: {
    marginBottom: 12,
  },

  /* 실시간 이벤트 카드 */
  realtimeCard: {
    padding: 12,
  },
  realtimeTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  realtimeEmpty: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  realtimeEmptyTitle: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 4,
  },
  realtimeEmptySubtitle: {
    fontSize: 11,
    color: '#9ca3af',
    marginTop: 4,
    textAlign: 'center',
  },

  realtimeItem: {
    backgroundColor: '#f9fafb',
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
  },
  realtimeItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  realtimeItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  realtimeItemType: {
    fontSize: 13,
    marginLeft: 8,
  },
  realtimeItemTime: {
    fontSize: 11,
    color: '#6b7280',
    marginLeft: 8,
  },
  realtimeItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  realtimePlayButton: {
    width: 28,
    height: 28,
    paddingHorizontal: 0,
    paddingVertical: 0,
    marginLeft: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  realtimeMemo: {
    marginTop: 6,
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 6,
    fontSize: 11,
    backgroundColor: '#eff6ff',
    color: '#1d4ed8',
  },

  /* 영상 Dialog */
  videoDialogBody: {
    marginTop: 12,
  },
  videoPlayerMock: {
    backgroundColor: '#000000',
    borderRadius: 10,
    aspectRatio: 16 / 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoPlayerText: {
    color: '#ffffff',
    fontSize: 13,
    marginTop: 8,
  },
  videoPlayerSubText: {
    color: '#e5e7eb',
    fontSize: 11,
    marginTop: 4,
  },
  videoDialogButtons: {
    marginTop: 12,
    flexDirection: 'row',
  },
  videoDialogConfirmButton: {
    flex: 1,
    backgroundColor: '#a855f7',
  },
  videoDialogConfirmText: {
    color: '#ffffff',
    fontSize: 14,
  },
});
