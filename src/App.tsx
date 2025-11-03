<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { Login } from './components/Login';
import { RoleSelection } from './components/RoleSelection';
import { CameraMode } from './components/CameraMode';
import { LiveMonitoring } from './components/LiveMonitoring';
import { Calendar } from './components/Calendar';
import { Reports } from './components/Reports';
import { Settings } from './components/Settings';
import { Profile } from './components/Profile';
import { Card } from './components/ui/card';
import { Button } from './components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './components/ui/tabs';
import { toast, Toaster } from 'sonner';

// Icons from lucide-react
import {
  Brain,
  AlertTriangle,
  Home,
  Calendar as CalendarIcon, 
  FileText,
  Settings as SettingsIcon
} from "lucide-react";

interface SleepRecord {
  id: string;
  date: Date;
  startTime: Date;
  endTime: Date;
  duration: number;
  events: Array<{type: string, severity: 'low' | 'medium' | 'high', time: Date}>;
  aiScore: number;
  quality: 'excellent' | 'good' | 'fair' | 'poor';
  tossingCount: number;
  cryingEvents: number;
}

interface Event {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high';
  timestamp: Date;
  description: string;
  aiConfidence: number;
  resolved: boolean;
  memo?: string;
}

interface DayRecord {
  date: string;
  events: Array<{type: string, time: string, severity: 'low' | 'medium' | 'high'}>;
  sleepTime: number;
  napTime: number;
  sleepQuality: 'excellent' | 'good' | 'fair' | 'poor';
  tossingCount: number;
  cryingCount: number;
  fallCount: number;
  memo: string;
}

interface UserInfo {
  name: string;
  email: string;
  avatar: string;
}

interface BabyInfo {
  name: string;
  gender: 'male' | 'female' | '';
  birthDate: string;
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'camera' | 'user' | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [babyInfo, setBabyInfo] = useState<BabyInfo>({name: '', gender: '', birthDate: ''});
  const [sleepRecords, setSleepRecords] = useState<SleepRecord[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [dayRecords, setDayRecords] = useState<DayRecord[]>([]);
  const [activeTab, setActiveTab] = useState('home');
  const [showCameraMode, setShowCameraMode] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // 로그인 후 샘플 데이터 로드
  useEffect(() => {
    if (isLoggedIn && selectedRole === 'user') {
      const sampleEvents: Event[] = [
        {
          id: '1',
          type: '뒤척임',
          severity: 'low',
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
          description: '정상적인 수면 중 자세 변화가 감지되었습니다.',
          aiConfidence: 85,
          resolved: false
        },
        {
          id: '2',
          type: '울음소리',
          severity: 'medium',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          description: '70dB 이상의 소음이 감지되었습니다.',
          aiConfidence: 92,
          resolved: true
        },
        {
          id: '3',
          type: '얼굴 가림',
          severity: 'high',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
          description: '베개로 인한 얼굴 가림 현상이 감지되었습니다.',
          aiConfidence: 96,
          resolved: true
        }
      ];

      const sampleData: SleepRecord[] = [
        {
          id: '1',
          date: new Date(),
          startTime: new Date(Date.now() - 4 * 60 * 60 * 1000),
          endTime: new Date(Date.now() - 1 * 60 * 60 * 1000),
          duration: 3 * 60 * 60,
          events: [
            {type: '뒤척임', severity: 'low', time: new Date(Date.now() - 2 * 60 * 60 * 1000)},
            {type: '울음소리', severity: 'medium', time: new Date(Date.now() - 1.5 * 60 * 60 * 1000)}
          ],
          aiScore: 85,
          quality: 'good',
          tossingCount: 8,
          cryingEvents: 2
        },
        {
          id: '2',
          date: new Date(Date.now() - 24 * 60 * 60 * 1000),
          startTime: new Date(Date.now() - 24 * 60 * 60 * 1000 - 2 * 60 * 60 * 1000),
          endTime: new Date(Date.now() - 24 * 60 * 60 * 1000),
          duration: 2 * 60 * 60,
          events: [
            {type: '얼굴 가림', severity: 'high', time: new Date(Date.now() - 24 * 60 * 60 * 1000 - 1 * 60 * 60 * 1000)}
          ],
          aiScore: 65,
          quality: 'fair',
          tossingCount: 12,
          cryingEvents: 1
        },
        {
          id: '3',
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          startTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 - 3 * 60 * 60 * 1000),
          endTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          duration: 3 * 60 * 60,
          events: [],
          aiScore: 95,
          quality: 'excellent',
          tossingCount: 3,
          cryingEvents: 0
        }
      ];

      const sampleDayRecords: DayRecord[] = [
        {
          date: new Date().toISOString().split('T')[0],
          events: [
            {type: '뒤척임', time: '14:30', severity: 'low'},
            {type: '울음소리', time: '15:45', severity: 'medium'}
          ],
          sleepTime: 480, // 8시간
          napTime: 90, // 1.5시간
          sleepQuality: 'good',
          tossingCount: 8,
          cryingCount: 2,
          fallCount: 0,
          memo: '오늘은 비교적 잘 잤어요. 오후에 약간의 소음이 있었지만 큰 문제는 없었습니다.'
        },
        {
          date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          events: [
            {type: '얼굴 가림', time: '16:20', severity: 'high'},
            {type: '낙상 감지', time: '17:15', severity: 'high'}
          ],
          sleepTime: 420, // 7시간
          napTime: 60, // 1시간
          sleepQuality: 'fair',
          tossingCount: 12,
          cryingCount: 1,
          fallCount: 1,
          memo: ''
        },
        {
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          events: [],
          sleepTime: 540, // 9시간
          napTime: 120, // 2시간
          sleepQuality: 'excellent',
          tossingCount: 3,
          cryingCount: 0,
          fallCount: 0,
          memo: '매우 편안한 하루였습니다.'
        }
      ];
      
      setSleepRecords(sampleData);
      setEvents(sampleEvents);
      setDayRecords(sampleDayRecords);
    }
  }, [isLoggedIn, selectedRole]);

  const handleLogin = (userInfo: UserInfo) => {
    setUserInfo(userInfo);
    setIsLoggedIn(true);
    toast.success(`${userInfo.name}님, 환영합니다!`);
  };

  const handleRoleSelect = (role: 'camera' | 'user') => {
    setSelectedRole(role);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setSelectedRole(null);
    setUserInfo(null);
    setBabyInfo({name: '', gender: '', birthDate: ''});
    setSleepRecords([]);
    setEvents([]);
    setDayRecords([]);
    setActiveTab('home');
    setShowCameraMode(false);
    setShowProfile(false);
    toast.success('로그아웃되었습니다');
  };

  const handleUpdateBabyInfo = (info: BabyInfo) => {
    setBabyInfo(info);
  };

  const handleEventDetected = (eventType: string, severity: 'low' | 'medium' | 'high') => {
    const newEvent: Event = {
      id: Date.now().toString(),
      type: eventType,
      severity,
      timestamp: new Date(),
      description: `${eventType}이(가) 감지되었습니다. ${severity === 'high' ? '즉시 확인이 필요합니다.' : '정상 범위 내의 활동입니다.'}`,
      aiConfidence: Math.floor(Math.random() * 20) + 80,
      resolved: false
    };
    
    setEvents(prev => [newEvent, ...prev]);
    
    // 오늘 날짜의 dayRecords 업데이트
    const today = new Date().toISOString().split('T')[0];
    setDayRecords(prev => {
      const existingRecord = prev.find(record => record.date === today);
      const currentTime = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
      
      if (existingRecord) {
        return prev.map(record => {
          if (record.date === today) {
            const updatedRecord = { 
              ...record,
              events: [...record.events, { type: eventType, time: currentTime, severity }]
            };
            
            // 이벤트 타입별 카운트 증가
            if (eventType === '뒤척임') {
              updatedRecord.tossingCount += 1;
            } else if (eventType === '울음소리') {
              updatedRecord.cryingCount += 1;
            } else if (eventType === '낙상 감지') {
              updatedRecord.fallCount += 1;
            }
            
            return updatedRecord;
          }
          return record;
        });
      } else {
        // 새로운 날짜 기록 생성
        const newRecord: DayRecord = {
          date: today,
          events: [{ type: eventType, time: currentTime, severity }],
          sleepTime: 0,
          napTime: 0,
          sleepQuality: 'good',
          tossingCount: eventType === '뒤척임' ? 1 : 0,
          cryingCount: eventType === '울음소리' ? 1 : 0,
          fallCount: eventType === '낙상 감지' ? 1 : 0,
          memo: ''
        };
        return [...prev, newRecord];
      }
    });
    
    if (severity === 'high') {
      toast.error(`⚠️ ${eventType} 감지! 즉시 확인하세요.`);
    } else if (severity === 'medium') {
      toast.warning(`📢 ${eventType} 감지`);
    } else {
      toast.info(`ℹ️ ${eventType} 감지`);
    }
  };

  const handleUpdateEventMemo = (eventId: string, memo: string) => {
    setEvents(prev => prev.map(event => 
      event.id === eventId ? { ...event, memo } : event
    ));
    toast.success('메모가 저장되었습니다');
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents(prev => prev.filter(event => event.id !== eventId));
    toast.success('알림이 삭제되었습니다');
  };

  const handleUpdateDayMemo = (date: string, memo: string) => {
    setDayRecords(prev => {
      const existingRecord = prev.find(record => record.date === date);
      if (existingRecord) {
        return prev.map(record => 
          record.date === date ? { ...record, memo } : record
        );
      } else {
        // 새로운 날짜 기록 생성
        const newRecord: DayRecord = {
          date,
          events: [],
          sleepTime: 0,
          napTime: 0,
          sleepQuality: 'good',
          tossingCount: 0,
          cryingCount: 0,
          fallCount: 0,
          memo
        };
        return [...prev, newRecord];
      }
    });
    toast.success('메모가 저장되었습니다');
  };

  const handleUpdateDayRecord = (date: string, updatedData: Partial<DayRecord>) => {
    setDayRecords(prev => {
      const existingRecord = prev.find(record => record.date === date);
      if (existingRecord) {
        return prev.map(record => 
          record.date === date ? { ...record, ...updatedData } : record
        );
      } else {
        // 새로운 날짜 기록 생성
        const newRecord: DayRecord = {
          date,
          events: [],
          sleepTime: 0,
          napTime: 0,
          sleepQuality: 'good',
          tossingCount: 0,
          cryingCount: 0,
          fallCount: 0,
          memo: '',
          ...updatedData
        };
        return [...prev, newRecord];
      }
    });
    toast.success('수면 기록이 저장되었습니다');
  };

  const handleClearData = () => {
    setSleepRecords([]);
    setEvents([]);
    setDayRecords([]);
    toast.success('모든 데이터가 삭제되었습니다');
  };

  // AI 인사이트 컴포넌트 생성 (dayRecords 기반)
  const generateAIInsights = () => {
    if (dayRecords.length === 0) return [];
    
    const avgTossing = dayRecords.reduce((sum, record) => sum + record.tossingCount, 0) / dayRecords.length;
    // 수면 시간 + 낮잠 시간을 합산 (분 단위 -> 시간 단위)
    const avgSleepHours = dayRecords.reduce((sum, record) => sum + (record.sleepTime + record.napTime), 0) / dayRecords.length / 60;
    const totalCrying = dayRecords.reduce((sum, record) => sum + record.cryingCount, 0);
    const totalFallDetection = dayRecords.reduce((sum, record) => sum + record.fallCount, 0);
    
    const insights = [];
    
    if (avgTossing > 15) {
      insights.push({
        type: 'warning',
        title: '뒤척임 빈도 높음',
        description: `평균 ${Math.round(avgTossing)}회의 뒤척임이 감지되었습니다. 수면 환경이나 침구류 점검을 권장합니다.`
      });
    } else if (avgTossing < 5) {
      insights.push({
        type: 'good',
        title: '안정적인 수면',
        description: '뒤척임이 적어 깊고 안정적인 수면을 취하고 있습니다.'
      });
    }
    
    if (avgSleepHours < 6) {
      insights.push({
        type: 'warning',
        title: '수면 시간 부족',
        description: `평균 ${Math.round(avgSleepHours * 10) / 10}시간으로 권장 수면 시간보다 부족합니다.`
      });
    } else if (avgSleepHours > 12) {
      insights.push({
        type: 'info',
        title: '충분한 수면',
        description: '충분한 수면 시간을 유지하고 있습니다.'
      });
    }
    
    if (totalCrying > 10) {
      insights.push({
        type: 'warning',
        title: '울음 빈도 증가',
        description: '울음이나 불편함을 나타내는 신호가 자주 감지되었습니다. 환경 점검이 필요할 수 있습니다.'
      });
    }

    if (totalFallDetection > 3) {
      insights.push({
        type: 'danger',
        title: '낙상 위험 감지',
        description: `${totalFallDetection}건의 낙상 이벤트가 감지되었습��다. 침대 안전장치를 점검하세요.`
      });
    } else if (totalFallDetection === 0) {
      insights.push({
        type: 'good',
        title: '안전한 수면 환경',
        description: '낙상이나 위험한 상황이 감지되지 않았습니다.'
      });
    }

    return insights;
  };

  const aiInsights = dayRecords.length > 0 ? (
    <Card className="p-3 bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
      <div className="flex items-center mb-3">
        <h2 className="flex items-center">
          <Brain className="w-4 h-4 mr-2 text-purple-400" />
          AI 수면 분석 리포트
        </h2>
      </div>
      
      <div className="space-y-2">
        {generateAIInsights().map((insight, index) => (
          <div 
            key={index} 
            className={`p-3 rounded-lg border-l-4 ${
              insight.type === 'warning' ? 'bg-yellow-50 border-yellow-400' :
              insight.type === 'danger' ? 'bg-red-50 border-red-400' :
              insight.type === 'good' ? 'bg-green-50 border-green-400' :
              'bg-blue-50 border-blue-400'
            }`}
          >
            <h4 className={`mb-1.5 flex items-center text-sm ${
              insight.type === 'warning' ? 'text-yellow-800' :
              insight.type === 'danger' ? 'text-red-800' :
              insight.type === 'good' ? 'text-green-800' :
              'text-blue-800'
            }`}>
              {insight.type === 'danger' && <AlertTriangle className="w-3.5 h-3.5 mr-1.5" />}
              {insight.title}
            </h4>
            <p className={`text-xs ${
              insight.type === 'warning' ? 'text-yellow-700' :
              insight.type === 'danger' ? 'text-red-700' :
              insight.type === 'good' ? 'text-green-700' :
              'text-blue-700'
            }`}>
              {insight.description}
            </p>
          </div>
        ))}
      </div>
    </Card>
  ) : null;

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  if (!selectedRole) {
    return <RoleSelection onRoleSelect={handleRoleSelect} />;
  }

  if (selectedRole === 'camera' || showCameraMode) {
    return <CameraMode onBack={() => {
      setSelectedRole(null);
      setShowCameraMode(false);
    }} />;
  }

  return (
    <div className="mx-auto bg-gradient-to-br from-white via-purple-50 to-violet-50 relative overflow-hidden" style={{ width: '412px', height: '917px' }}>
      {/* 메인 콘텐츠 */}
      <div className="p-3 pb-20 pt-3 overflow-y-auto" style={{ height: '917px' }}>
        {showProfile ? (
          <Profile 
            onBack={() => setShowProfile(false)}
            userInfo={userInfo!}
            babyInfo={babyInfo}
            onUpdateBabyInfo={handleUpdateBabyInfo}
          />
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsContent value="home" className="mt-0">
              <LiveMonitoring 
                onEventDetected={handleEventDetected}
                events={events}
                onUpdateEventMemo={handleUpdateEventMemo}
                onDeleteEvent={handleDeleteEvent}
                aiInsights={aiInsights}
                onOpenMonitoring={() => setShowCameraMode(true)}
              />
            </TabsContent>
            
            <TabsContent value="calendar" className="mt-0">
              <Calendar 
                dayRecords={dayRecords}
                onUpdateDayMemo={handleUpdateDayMemo}
                onUpdateDayRecord={handleUpdateDayRecord}
              />
            </TabsContent>
            
            <TabsContent value="reports" className="mt-0">
              <Reports dayRecords={dayRecords} />
            </TabsContent>
            
            <TabsContent value="settings" className="mt-0">
              <Settings 
                onClearData={handleClearData}
                onLogout={handleLogout}
                userInfo={userInfo!}
                onOpenProfile={() => setShowProfile(true)}
                babyInfo={babyInfo}
              />
            </TabsContent>
          </Tabs>
        )}
      </div>

      {/* 하단 네비게이션 - 프로필 화면에서는 숨김 */}
      {!showProfile && (
        <div className="absolute bottom-0 left-0 w-full bg-white/95 backdrop-blur-sm border-t border-purple-100" style={{ width: '412px' }}>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 h-14 bg-transparent">
              <TabsTrigger 
                value="home" 
                className="flex flex-col items-center gap-1 data-[state=active]:bg-purple-50 data-[state=active]:text-purple-400"
              >
                <Home className="w-5 h-5" />
                <span className="text-xs">홈</span>
              </TabsTrigger>
              <TabsTrigger 
                value="calendar"
                className="flex flex-col items-center gap-1 data-[state=active]:bg-purple-50 data-[state=active]:text-purple-400"
              >
                <CalendarIcon className="w-5 h-5" />
                <span className="text-xs">캘린더</span>
              </TabsTrigger>
              <TabsTrigger 
                value="reports"
                className="flex flex-col items-center gap-1 data-[state=active]:bg-purple-50 data-[state=active]:text-purple-400"
              >
                <FileText className="w-5 h-5" />
                <span className="text-xs">리포트</span>
              </TabsTrigger>
              <TabsTrigger 
                value="settings"
                className="flex flex-col items-center gap-1 data-[state=active]:bg-purple-50 data-[state=active]:text-purple-400"
              >
                <SettingsIcon className="w-5 h-5" />
                <span className="text-xs">설정</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      )}
      <Toaster />
    </div>
  );
}
=======
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
>>>>>>> origin/feat/fe-skeleton
