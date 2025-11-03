import React, { useState } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Calendar as CalendarComponent } from './ui/calendar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import {
  CalendarIcon, Clock, Moon, Activity, Heart, Edit3, Save, Volume2,
  AlertTriangle, ChevronLeft, ChevronRight, Play, Video
} from 'lucide-react';

interface DayRecord {
  date: string;
  events: Array<{ type: string; time: string; severity: 'low' | 'medium' | 'high' }>;
  sleepTime: number; // 분
  napTime: number;   // 분
  sleepQuality: 'excellent' | 'good' | 'fair' | 'poor';
  tossingCount: number;
  cryingCount: number;
  fallCount: number;
  memo: string;
}

interface CalendarProps {
  dayRecords: DayRecord[];
  onUpdateDayMemo: (date: string, memo: string) => void;
  onUpdateDayRecord: (date: string, updatedData: Partial<DayRecord>) => void;
}

export function Calendar({ dayRecords, onUpdateDayMemo, onUpdateDayRecord }: CalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [memoText, setMemoText] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [showVideoDialog, setShowVideoDialog] = useState(false);
  const [selectedVideoEvent, setSelectedVideoEvent] =
    useState<{ type: string; time: string } | null>(null);

  // 수동 입력 필드 상태
  const [manualEntry, setManualEntry] = useState({
    sleepTime: 0,
    napTime: 0,
    tossingCount: 0,
    cryingCount: 0,
    fallCount: 0,
    sleepQuality: 'good' as 'excellent' | 'good' | 'fair' | 'poor',
  });

  // 선택된 날짜의 기록
  const selectedDateString = selectedDate?.toISOString().split('T')[0];
  const selectedDayRecord = React.useMemo(
    () => dayRecords.find((record) => record.date === selectedDateString),
    [dayRecords, selectedDateString]
  );

  // 초기 로드: 오늘 데이터 세팅
  React.useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayRecord = dayRecords.find((r) => r.date === today);
    setMemoText(todayRecord?.memo || '');
    if (todayRecord) {
      setManualEntry({
        sleepTime: todayRecord.sleepTime,
        napTime: todayRecord.napTime,
        tossingCount: todayRecord.tossingCount,
        cryingCount: todayRecord.cryingCount,
        fallCount: todayRecord.fallCount,
        sleepQuality: todayRecord.sleepQuality,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}분`;
    return `${hours}시간 ${mins > 0 ? `${mins}분` : ''}`;
    // prettier-ignore
  };

  const getQualityColor = (q: 'excellent' | 'good' | 'fair' | 'poor') => {
    switch (q) {
      case 'excellent': return 'bg-green-100 text-green-800';
      case 'good':      return 'bg-purple-100 text-purple-500';
      case 'fair':      return 'bg-yellow-100 text-yellow-800';
      case 'poor':      return 'bg-red-100 text-red-800';
    }
  };

  const getQualityText = (q: 'excellent' | 'good' | 'fair' | 'poor') => {
    switch (q) {
      case 'excellent': return '우수';
      case 'good':      return '좋음';
      case 'fair':      return '보통';
      case 'poor':      return '나쁨';
    }
  };

  const getSeverityColor = (s: 'low' | 'medium' | 'high') => {
    switch (s) {
      case 'low':    return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high':   return 'bg-red-100 text-red-800';
    }
  };

  const handleSaveRecord = () => {
    if (selectedDateString) {
      onUpdateDayRecord(selectedDateString, {
        sleepTime: manualEntry.sleepTime,
        napTime: manualEntry.napTime,
        tossingCount: manualEntry.tossingCount,
        cryingCount: manualEntry.cryingCount,
        fallCount: manualEntry.fallCount,
        sleepQuality: manualEntry.sleepQuality,
        memo: memoText,
      });
      setEditMode(false);
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    // 같은 날짜 재클릭 시 유지
    if (
      date && selectedDate &&
      date.toISOString().split('T')[0] === selectedDate.toISOString().split('T')[0]
    ) {
      setSelectedDate(date);
      return;
    }

    setSelectedDate(date);
    setEditMode(false);

    if (date) {
      const dateString = date.toISOString().split('T')[0];
      const record = dayRecords.find((r) => r.date === dateString);
      setMemoText(record?.memo || '');
      if (record) {
        setManualEntry({
          sleepTime: record.sleepTime,
          napTime: record.napTime,
          tossingCount: record.tossingCount,
          cryingCount: record.cryingCount,
          fallCount: record.fallCount,
          sleepQuality: record.sleepQuality,
        });
      } else {
        setManualEntry({
          sleepTime: 0,
          napTime: 0,
          tossingCount: 0,
          cryingCount: 0,
          fallCount: 0,
          sleepQuality: 'good',
        });
      }
    }
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    if (!selectedDate) return;
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + (direction === 'next' ? 1 : -1));
    handleDateSelect(d);
  };

  return (
    <div className="h-full space-y-4">
      {/* 캘린더 카드 */}
      <Card className="p-4 border-purple-100">
        <div className="flex items-center justify-center mb-4">
          <h2 className="flex items-center">
            <CalendarIcon className="w-5 h-5 mr-2 text-purple-400" />
            수면 다이어리
          </h2>
        </div>

        {/* 날짜 네비 */}
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" size="sm" onClick={() => navigateDate('prev')}>
            <ChevronLeft className="w-5 h-5" />
          </Button>

          <div className="text-center">
            <p className="text-purple-500">
              {selectedDate?.toLocaleDateString('ko-KR', {
                year: 'numeric', month: 'long', day: 'numeric', weekday: 'long',
              })}
            </p>
          </div>

          <Button variant="ghost" size="sm" onClick={() => navigateDate('next')}>
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        {/* 캘린더 - 표 레이아웃 유지 */}
        <div className="w-full">
          <CalendarComponent
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            className="w-full rounded-md border-0"
            classNames={{
              /* ✔ table 레이아웃을 해치지 않도록 flex 금지 */
              months: "w-full",
              month: "w-full space-y-3",
              table: "w-full border-collapse",
              head_row: "",                              // flex ❌
              head_cell: "w-10 py-2 text-center text-xs font-medium text-muted-foreground",
              row: "",                                   // flex ❌
              cell: "p-0 text-center align-middle",      // 표 기본 정렬
              day: "size-8 p-0 font-normal aria-selected:opacity-100",
              day_selected:
                "bg-primary text-primary-foreground rounded-full hover:bg-primary hover:text-primary-foreground",
              day_today: "bg-accent text-accent-foreground rounded-full",
              day_outside: "text-muted-foreground opacity-50",
              day_disabled: "text-muted-foreground opacity-50",
            }}
          />
        </div>
      </Card>

      {/* 이벤트/데이터 카드 */}
      <Card className="p-4 border-purple-100">
        <div className="flex items-center justify-between mb-4">
          <h3>{!editMode ? '수면 기록' : selectedDayRecord ? '기록 수정' : '수동 기록 추가'}</h3>
          {!editMode && selectedDayRecord && (
            <Button variant="outline" size="sm" onClick={() => setEditMode(true)}>
              <Edit3 className="w-3 h-3 mr-1" />
              수정
            </Button>
          )}
          {!editMode && !selectedDayRecord && (
            <Button variant="outline" size="sm" onClick={() => setEditMode(true)}>
              <Edit3 className="w-3 h-3 mr-1" />
              수동 기록 추가
            </Button>
          )}
        </div>

        {!editMode ? (
          selectedDayRecord ? (
            <div className="space-y-4">
              {/* 주요 통계 */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-purple-50 rounded-xl p-3 text-center border border-purple-100">
                  <Moon className="w-5 h-5 mx-auto mb-1 text-purple-400" />
                  <div className="text-lg text-purple-500">
                    {formatTime(selectedDayRecord.sleepTime)}
                  </div>
                  <p className="text-xs text-purple-400">수면 시간</p>
                </div>

                <div className="bg-violet-50 rounded-xl p-3 text-center border border-violet-100">
                  <Clock className="w-5 h-5 mx-auto mb-1 text-violet-400" />
                  <div className="text-lg text-violet-500">
                    {formatTime(selectedDayRecord.napTime)}
                  </div>
                  <p className="text-xs text-violet-400">낮잠 시간</p>
                </div>

                <div className="bg-indigo-50 rounded-xl p-3 text-center border border-indigo-100">
                  <Activity className="w-5 h-5 mx-auto mb-1 text-indigo-400" />
                  <div className="text-lg text-indigo-500">
                    {selectedDayRecord.tossingCount}회
                  </div>
                  <p className="text-xs text-indigo-400">뒤척임 횟수</p>
                </div>

                <div className="bg-orange-50 rounded-xl p-3 text-center border border-orange-100">
                  <Volume2 className="w-5 h-5 mx-auto mb-1 text-orange-600" />
                  <div className="text-lg text-orange-800">
                    {selectedDayRecord.cryingCount || 0}회
                  </div>
                  <p className="text-xs text-orange-600">울음 소리</p>
                </div>

                <div className="bg-red-50 rounded-xl p-3 text-center border border-red-100">
                  <AlertTriangle className="w-5 h-5 mx-auto mb-1 text-red-600" />
                  <div className="text-lg text-red-800">
                    {selectedDayRecord.fallCount || 0}회
                  </div>
                  <p className="text-xs text-red-600">낙상 감지</p>
                </div>

                <div className="bg-green-50 rounded-xl p-3 text-center border border-green-100">
                  <Heart className="w-5 h-5 mx-auto mb-1 text-green-600" />
                  <Badge className={getQualityColor(selectedDayRecord.sleepQuality)} variant="secondary">
                    {getQualityText(selectedDayRecord.sleepQuality)}
                  </Badge>
                  <p className="text-xs text-green-600 mt-1">수면 품질</p>
                </div>
              </div>

              {/* 이벤트 목록 */}
              {selectedDayRecord.events.length > 0 && (
                <div>
                  <h4 className="mb-3 flex items-center text-sm">
                    <Activity className="w-4 h-4 mr-2 text-purple-400" />
                    감지된 이벤트 ({selectedDayRecord.events.length}건)
                  </h4>
                  <div className="space-y-2">
                    {selectedDayRecord.events.map((event, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-purple-50 rounded-lg border border-purple-100"
                      >
                        <div>
                          <span className="text-sm">{event.type}</span>
                          <p className="text-xs text-gray-600">{event.time}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getSeverityColor(event.severity)}>
                            {event.severity === 'high' ? '높음' : event.severity === 'medium' ? '보통' : '낮음'}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={() => {
                              setSelectedVideoEvent({ type: event.type, time: event.time });
                              setShowVideoDialog(true);
                            }}
                          >
                            <Play className="w-3.5 h-3.5 text-purple-500" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 메모 */}
              <div>
                <h4 className="mb-2 flex items-center text-sm">
                  <Edit3 className="w-4 h-4 mr-2 text-purple-400" />
                  메모
                </h4>
                <p className="text-sm text-gray-600 p-3 bg-purple-50 rounded-lg min-h-[60px]">
                  {selectedDayRecord.memo || '메모가 없습니다.'}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-sm text-gray-500 mb-2">이 날짜의 기록이 없습니다.</p>
              <p className="text-xs text-gray-400">수동 기록 추가 버튼을 눌러 데이터를 입력하세요.</p>
            </div>
          )
        ) : (
          <div className="space-y-4">
            {selectedDayRecord && (
              <p className="text-sm text-purple-600 bg-purple-50 p-2 rounded">기존 기록을 수정할 수 있습니다.</p>
            )}

            {!selectedDayRecord && (
              <p className="text-sm text-gray-600 text-center mb-4">
                이 날짜의 자동 기록이 없습니다. 수동으로 기록을 추가할 수 있습니다.
              </p>
            )}

            {/* 수동 입력 폼 */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-sm">수면 시간 (분)</Label>
                <Input
                  type="number"
                  value={manualEntry.sleepTime || ''}
                  onChange={(e) =>
                    setManualEntry({ ...manualEntry, sleepTime: e.target.value === '' ? 0 : Number(e.target.value) })
                  }
                  placeholder="480"
                  className="mt-1"
                  min="0"
                />
              </div>
              <div>
                <Label className="text-sm">낮잠 시간 (분)</Label>
                <Input
                  type="number"
                  value={manualEntry.napTime || ''}
                  onChange={(e) =>
                    setManualEntry({ ...manualEntry, napTime: e.target.value === '' ? 0 : Number(e.target.value) })
                  }
                  placeholder="90"
                  className="mt-1"
                  min="0"
                />
              </div>
              <div>
                <Label className="text-sm">뒤척임 횟수</Label>
                <Input
                  type="number"
                  value={manualEntry.tossingCount || ''}
                  onChange={(e) =>
                    setManualEntry({ ...manualEntry, tossingCount: e.target.value === '' ? 0 : Number(e.target.value) })
                  }
                  placeholder="0"
                  className="mt-1"
                  min="0"
                />
              </div>
              <div>
                <Label className="text-sm">울음 소리 (회)</Label>
                <Input
                  type="number"
                  value={manualEntry.cryingCount || ''}
                  onChange={(e) =>
                    setManualEntry({ ...manualEntry, cryingCount: e.target.value === '' ? 0 : Number(e.target.value) })
                  }
                  placeholder="0"
                  className="mt-1"
                  min="0"
                />
              </div>
              <div>
                <Label className="text-sm">낙상 감지 (회)</Label>
                <Input
                  type="number"
                  value={manualEntry.fallCount || ''}
                  onChange={(e) =>
                    setManualEntry({ ...manualEntry, fallCount: e.target.value === '' ? 0 : Number(e.target.value) })
                  }
                  placeholder="0"
                  className="mt-1"
                  min="0"
                />
              </div>
              <div>
                <Label className="text-sm">수면 품질</Label>
                <Select
                  value={manualEntry.sleepQuality}
                  onValueChange={(v: 'excellent' | 'good' | 'fair' | 'poor') =>
                    setManualEntry({ ...manualEntry, sleepQuality: v })
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="excellent">우수</SelectItem>
                    <SelectItem value="good">좋음</SelectItem>
                    <SelectItem value="fair">보통</SelectItem>
                    <SelectItem value="poor">나쁨</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* 메모 */}
            <div>
              <Label className="text-sm flex items-center mb-2">
                <Edit3 className="w-4 h-4 mr-2 text-purple-400" />
                메모
              </Label>
              <Textarea
                placeholder="오늘의 특이사항, 아기 상태, 환경 변화 등을 기록해보세요..."
                value={memoText}
                onChange={(e) => setMemoText(e.target.value)}
                rows={3}
                className="resize-none border-purple-200 focus:border-purple-400"
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSaveRecord} className="flex-1 bg-purple-400 hover:bg-purple-500">
                <Save className="w-4 h-4 mr-2" />
                저장
              </Button>
              {editMode && (
                <Button onClick={() => setEditMode(false)} variant="outline">
                  취소
                </Button>
              )}
            </div>
          </div>
        )}
      </Card>

      {/* 영상 재생 Dialog */}
      <Dialog open={showVideoDialog} onOpenChange={setShowVideoDialog}>
        <DialogContent style={{ maxWidth: '380px' }}>
          <DialogHeader>
            <DialogTitle className="text-purple-500">이벤트 영상</DialogTitle>
            <DialogDescription>
              {selectedVideoEvent && selectedDate &&
                `${selectedVideoEvent.type} - ${selectedDate.toLocaleDateString('ko-KR')} ${selectedVideoEvent.time}`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
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
