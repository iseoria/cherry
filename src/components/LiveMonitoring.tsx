import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { ScrollArea } from './ui/scroll-area';
import { Bell, AlertTriangle, Shield, Eye, Edit3, Save, Video, Play, X } from 'lucide-react';

interface LiveMonitoringProps {
  onEventDetected: (event: string, severity: 'low' | 'medium' | 'high') => void;
  events: Array<{id: string, type: string, severity: 'low' | 'medium' | 'high', timestamp: Date, memo?: string}>;
  onUpdateEventMemo: (eventId: string, memo: string) => void;
  onDeleteEvent: (eventId: string) => void;
  aiInsights?: React.ReactNode;
  onOpenMonitoring: () => void;
}

export default function LiveMonitoring({ onEventDetected, events, onUpdateEventMemo, onDeleteEvent, aiInsights, onOpenMonitoring }: LiveMonitoringProps) {
  const [currentEvents, setCurrentEvents] = useState<Array<{id: string, type: string, timestamp: Date, severity: 'low' | 'medium' | 'high'}>>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [memoText, setMemoText] = useState('');
  const [showVideoDialog, setShowVideoDialog] = useState(false);
  const [selectedVideoEvent, setSelectedVideoEvent] = useState<{type: string, timestamp: Date} | null>(null);

  // 실시간 이벤트 시뮬레이션
  useEffect(() => {
    const interval = setInterval(() => {
      // 랜덤하게 이벤트 발생 시뮬레이션
      if (Math.random() > 0.97) {
        const eventTypes = ['낙상 감지', '뒤척임', '울음소리', '얼굴 가림'];
        const severities: ('low' | 'medium' | 'high')[] = ['low', 'medium', 'high'];
        const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
        const severity = severities[Math.floor(Math.random() * severities.length)];
        
        const newEvent = {
          id: Date.now().toString(),
          type: eventType,
          timestamp: new Date(),
          severity
        };
        
        setCurrentEvents(prev => [newEvent, ...prev.slice(0, 9)]);
        onEventDetected(eventType, severity);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [onEventDetected]);

  const getSeverityColor = (severity: 'low' | 'medium' | 'high') => {
    switch (severity) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
    }
  };

  const getSeverityIcon = (severity: 'low' | 'medium' | 'high') => {
    switch (severity) {
      case 'low': return <Shield className="w-4 h-4" />;
      case 'medium': return <Eye className="w-4 h-4" />;
      case 'high': return <AlertTriangle className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* 알림 헤더 */}
      <div className="flex justify-end">
        <Dialog open={showNotifications} onOpenChange={setShowNotifications}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="relative bg-purple-50 border-purple-200 hover:bg-purple-100">
              <Bell className="w-4 h-4 text-purple-400" />
              {events.length > 0 && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {events.length > 9 ? '9+' : events.length}
                </div>
              )}
              <span className="text-purple-400 ml-2">알림</span>
            </Button>
          </DialogTrigger>
          <DialogContent style={{ maxWidth: '380px' }}>
            <DialogHeader>
              <DialogTitle className="text-purple-500">알림 기록</DialogTitle>
              <DialogDescription>최근 감지된 이벤트 목록을 확인할 수 있습니다.</DialogDescription>
            </DialogHeader>
            <ScrollArea className="h-96">
              {events.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <Bell className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p>알림 기록이 없습니다</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {events.slice(0, 20).map(event => (
                    <div key={event.id} className="p-2.5 border rounded-lg border-purple-100 bg-white relative">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-1 right-1 h-6 w-6 p-0 hover:bg-red-100"
                        onClick={() => onDeleteEvent(event.id)}
                      >
                        <X className="w-3 h-3 text-gray-500 hover:text-red-600" />
                      </Button>
                      <div className="flex items-start justify-between mb-1.5 pr-6">
                        <div className="flex items-center space-x-1.5 flex-1">
                          {getSeverityIcon(event.severity)}
                          <span className="text-sm">{event.type}</span>
                          <Badge className={`${getSeverityColor(event.severity)} text-xs px-1.5 py-0`}>
                            {event.severity === 'low' ? '낮음' : 
                             event.severity === 'medium' ? '보통' : '높음'}
                          </Badge>
                        </div>
                        <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                          {event.timestamp.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })} {event.timestamp.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 ml-5 mb-1">
                        {event.type === '낙상 감지' && '침대에서 떨어질 위험이 감지되었습니다'}
                        {event.type === '뒤척임' && '수면 중 자세 변화가 감지되었습니다'}
                        {event.type === '울음소리' && '아기가 울고 있습니다. 확인이 필요합니다'}
                        {event.type === '얼굴 가림' && '얼굴이 가려져 있습니다. 즉시 확인하세요'}
                        {!['낙상 감지', '뒤척임', '울음소리', '얼굴 가림'].includes(event.type) && '이벤트가 감지되었습니다'}
                      </p>
                      {event.memo && (
                        <p className="text-xs text-purple-700 bg-purple-50 p-1.5 rounded ml-5 mt-1">📝 {event.memo}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>

      {/* 실시간 모니터링 버튼 */}
      <Card className="p-3 bg-gradient-to-r from-purple-100 to-violet-100 border-purple-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Video className="w-5 h-5 mr-2 text-purple-500" />
            <div>
              <h3 className="text-purple-600">실시간 모니터링</h3>
              <p className="text-xs text-purple-500">카메라 영상을 실시간으로 확인하세요</p>
            </div>
          </div>
          <Button 
            onClick={onOpenMonitoring}
            className="bg-purple-500 hover:bg-purple-600 text-white"
            size="sm"
          >
            <Play className="w-3 h-3 mr-1" />
            시작
          </Button>
        </div>
      </Card>

      {/* AI 인사이트 (리포트에서 이동) */}
      {aiInsights && (
        <div>{aiInsights}</div>
      )}

      {/* 실시간 이벤트 */}
      <Card className="p-3">
        <h3 className="mb-3">실시간 이벤트</h3>
        
        {currentEvents.length === 0 ? (
          <div className="text-center text-gray-500 py-3">
            <Shield className="w-7 h-7 mx-auto mb-2 text-gray-400" />
            <p className="text-sm">현재 감지된 이벤트가 없습니다</p>
            <p className="text-xs mt-1">낙상 감지, 뒤척임, 울음소리, 얼굴 가림을 실시간으로 모니터링합니다</p>
          </div>
        ) : (
          <div className="space-y-2">
            {currentEvents.map(event => {
              const fullEvent = events.find(e => e.id === event.id);
              return (
                <div key={event.id} className="p-2.5 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center space-x-2">
                      {getSeverityIcon(event.severity)}
                      <div>
                        <p className="text-sm">{event.type}</p>
                        <p className="text-xs text-gray-500">
                          {event.timestamp.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <Badge className={`${getSeverityColor(event.severity)} text-xs px-1.5 py-0`}>
                        {event.severity === 'low' ? '낮음' : 
                         event.severity === 'medium' ? '보통' : '높음'}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={() => {
                          setSelectedVideoEvent({ type: event.type, timestamp: event.timestamp });
                          setShowVideoDialog(true);
                        }}
                      >
                        <Play className="w-3.5 h-3.5 text-purple-500" />
                      </Button>
                    </div>
                  </div>
                  {fullEvent?.memo && (
                    <div className="mt-1.5 p-1.5 bg-blue-50 rounded text-xs text-blue-800">
                      📝 {fullEvent.memo}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* 영상 재생 Dialog */}
      <Dialog open={showVideoDialog} onOpenChange={setShowVideoDialog}>
        <DialogContent style={{ maxWidth: '380px' }}>
          <DialogHeader>
            <DialogTitle className="text-purple-500">이벤트 영상</DialogTitle>
            <DialogDescription>
              {selectedVideoEvent && `${selectedVideoEvent.type} - ${selectedVideoEvent.timestamp.toLocaleString('ko-KR')}`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            {/* 영상 플레이어 */}
            <div className="bg-black rounded-lg overflow-hidden aspect-video flex items-center justify-center">
              <div className="text-center text-white">
                <Video className="w-12 h-12 mx-auto mb-2 opacity-60" />
                <p className="text-sm">영상 재생 중...</p>
                <p className="text-xs mt-1 opacity-60">실제 환경에서 녹화된 영상이 재생됩니다</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                className="flex-1 bg-purple-500 hover:bg-purple-600"
                onClick={() => setShowVideoDialog(false)}
              >
                확인
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
