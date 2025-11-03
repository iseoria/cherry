import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line, CartesianGrid, Tooltip } from 'recharts';
import { TrendingUp, Activity, Calendar, Brain, AlertTriangle, Lightbulb } from 'lucide-react';

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

interface ReportsProps {
  dayRecords: DayRecord[];
}

export function Reports({ dayRecords }: ReportsProps) {
  const [analysisRange, setAnalysisRange] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [startDate, setStartDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [showGraphs, setShowGraphs] = useState(false);

  const getDaysCount = () => {
    switch (analysisRange) {
      case 'daily': return 1;
      case 'weekly': return 7;
      case 'monthly': return 30;
    }
  };

  // 수면 시간 추이 데이터 (수면시간 + 낮잠시간)
  const getSleepTimeAnalysis = () => {
    const daysCount = getDaysCount();
    const start = new Date(startDate);
    const dates = Array.from({ length: daysCount }, (_, i) => {
      const date = new Date(start);
      date.setDate(date.getDate() + i);
      return date.toISOString().split('T')[0];
    });

    return dates.map(dateStr => {
      const record = dayRecords.find(r => r.date === dateStr);
      
      // 수면시간 + 낮잠시간을 합산하여 시간 단위로 변환
      const totalMinutes = record ? (record.sleepTime + record.napTime) : 0;
      const hours = totalMinutes / 60;
      
      const formatLabel = () => {
        const date = new Date(dateStr);
        switch (analysisRange) {
          case 'daily':
            return date.toLocaleDateString('ko-KR', { hour: '2-digit' });
          case 'weekly':
            return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
          case 'monthly':
            return date.toLocaleDateString('ko-KR', { day: 'numeric' });
        }
      };
      
      return {
        date: formatLabel(),
        hours: Math.round(hours * 10) / 10
      };
    });
  };

  // 뒤척임 추이 데이터
  const getTossingAnalysis = () => {
    const daysCount = getDaysCount();
    const start = new Date(startDate);
    const dates = Array.from({ length: daysCount }, (_, i) => {
      const date = new Date(start);
      date.setDate(date.getDate() + i);
      return date.toISOString().split('T')[0];
    });

    return dates.map(dateStr => {
      const record = dayRecords.find(r => r.date === dateStr);
      const count = record ? record.tossingCount : 0;
      
      const formatLabel = () => {
        const date = new Date(dateStr);
        switch (analysisRange) {
          case 'daily':
            return date.toLocaleDateString('ko-KR', { hour: '2-digit' });
          case 'weekly':
            return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
          case 'monthly':
            return date.toLocaleDateString('ko-KR', { day: 'numeric' });
        }
      };
      
      return {
        date: formatLabel(),
        count: count
      };
    });
  };

  // 수면 질 분석 추이 (품질을 점수로 변환)
  const getSleepQualityAnalysis = () => {
    const daysCount = getDaysCount();
    const start = new Date(startDate);
    const dates = Array.from({ length: daysCount }, (_, i) => {
      const date = new Date(start);
      date.setDate(date.getDate() + i);
      return date.toISOString().split('T')[0];
    });

    const qualityToScore = (quality: 'excellent' | 'good' | 'fair' | 'poor') => {
      switch (quality) {
        case 'excellent': return 95;
        case 'good': return 80;
        case 'fair': return 60;
        case 'poor': return 40;
      }
    };

    return dates.map(dateStr => {
      const record = dayRecords.find(r => r.date === dateStr);
      const score = record ? qualityToScore(record.sleepQuality) : 0;
      
      const formatLabel = () => {
        const date = new Date(dateStr);
        switch (analysisRange) {
          case 'daily':
            return date.toLocaleDateString('ko-KR', { hour: '2-digit' });
          case 'weekly':
            return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
          case 'monthly':
            return date.toLocaleDateString('ko-KR', { day: 'numeric' });
        }
      };
      
      return {
        date: formatLabel(),
        score: score
      };
    });
  };

  // AI 분석 생성
  const generateDetailedAIAnalysis = () => {
    const daysCount = getDaysCount();
    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(end.getDate() + daysCount);

    const relevantRecords = dayRecords.filter(record => {
      const recordDate = new Date(record.date);
      return recordDate >= start && recordDate < end;
    });

    if (relevantRecords.length === 0) {
      return {
        summary: '선택한 기간에 데이터가 없습니다.',
        sleepPattern: [],
        recommendations: [],
        concerns: []
      };
    }

    const avgTossing = relevantRecords.reduce((sum, record) => sum + record.tossingCount, 0) / relevantRecords.length;
    // 수면시간 + 낮잠시간을 합산하여 평균 계산 (분 -> 시간)
    const avgSleepHours = relevantRecords.reduce((sum, record) => sum + (record.sleepTime + record.napTime), 0) / relevantRecords.length / 60;
    const qualityToScore = (quality: 'excellent' | 'good' | 'fair' | 'poor') => {
      switch (quality) {
        case 'excellent': return 95;
        case 'good': return 80;
        case 'fair': return 60;
        case 'poor': return 40;
      }
    };
    const avgQualityScore = relevantRecords.reduce((sum, record) => sum + qualityToScore(record.sleepQuality), 0) / relevantRecords.length;
    const totalCrying = relevantRecords.reduce((sum, record) => sum + record.cryingCount, 0);
    const totalFallDetection = relevantRecords.reduce((sum, record) => sum + record.fallCount, 0);

    // 수면 패턴 분석
    const sleepPattern = [
      `선택한 ${analysisRange === 'daily' ? '일간' : analysisRange === 'weekly' ? '주간' : '월간'} 기간 동안 총 ${relevantRecords.length}일의 수면 데이터를 분석했습니다.`,
      `평균 수면 시간은 ${Math.round(avgSleepHours * 10) / 10}시간으로 ${avgSleepHours >= 8 ? '권장 수면 시간을 충족하고 있습니다' : '권장 수면 시간보다 부족합니다'}.`,
      `평균 뒤척임 횟수는 ${Math.round(avgTossing)}회로 ${avgTossing < 10 ? '안정적인 수면 상태' : avgTossing < 20 ? '보통 수준' : '다소 불안정한 수면 상태'}를 보이고 있습니다.`,
      `수면 품질 점수는 평균 ${Math.round(avgQualityScore)}점으로 ${avgQualityScore >= 85 ? '우수한' : avgQualityScore >= 70 ? '양호한' : avgQualityScore >= 50 ? '보통' : '낮은'} 수준입니다.`
    ];

    // 우려사항
    const concerns = [];
    if (totalFallDetection > 0) {
      concerns.push({
        type: 'danger',
        title: '낙상 위험 감지',
        description: `${totalFallDetection}건의 낙상이 감지되었습니다. 침대 안전 장치 점검이 필요합니다.`
      });
    }
    if (totalCrying > relevantRecords.length * 3) {
      concerns.push({
        type: 'warning',
        title: '울음 빈도 증가',
        description: `일평균 ${Math.round(totalCrying / relevantRecords.length * 10) / 10}회의 울음이 감지되었습니다. 수면 환경이나 컨디션 확인이 필요할 수 있습니다.`
      });
    }
    if (avgTossing > 20) {
      concerns.push({
        type: 'warning',
        title: '뒤척임 빈도 높음',
        description: '평균 이상의 뒤척임이 관찰되었습니다. 침구 온도, 습도, 편안함 등을 점검해보세요.'
      });
    }
    if (avgSleepHours < 7) {
      concerns.push({
        type: 'warning',
        title: '수면 시간 부족',
        description: '영유아에게 필요한 권장 수면 시간보다 부족합니다. 수면 일정 조정을 고려하세요.'
      });
    }

    // 권장사항
    const recommendations = [];
    if (avgQualityScore >= 85) {
      recommendations.push('현재 수면 패턴이 매우 좋습니다. 현재 환경과 루틴을 유지하세요.');
    }
    recommendations.push('일정한 수면 시간을 유지하여 생체 리듬을 안정화하세요.');
    if (avgTossing > 10) {
      recommendations.push('뒤척임이 많은 시간대에는 실내 온도를 18-20도로 유지하고 습도를 40-60%로 조절하세요.');
    }
    if (totalCrying > 0) {
      recommendations.push('울음이 자주 발생하는 시간대를 파악하여 선제적으로 대응하세요.');
    }
    recommendations.push('수면 전 안정적인 루틴(목욕, 마사지, 자장가 등)을 만들어 보세요.');
    recommendations.push('낮 시간 충분한 활동으로 밤 수면의 질을 높이세요.');

    return {
      summary: `${analysisRange === 'daily' ? '오늘' : analysisRange === 'weekly' ? '이번 주' : '이번 달'} 수면 패턴은 전반적으로 ${avgQualityScore >= 70 ? '양호' : '개선이 필요'}합니다.`,
      sleepPattern,
      recommendations,
      concerns
    };
  };

  const sleepTimeData = getSleepTimeAnalysis();
  const tossingData = getTossingAnalysis();
  const sleepQualityData = getSleepQualityAnalysis();
  const aiAnalysis = generateDetailedAIAnalysis();

  // 통계 계산 헬퍼
  const getStats = () => {
    if (dayRecords.length === 0) return { avgSleep: 0, avgTossing: 0, avgQuality: 0, totalEvents: 0 };
    
    const avgSleep = dayRecords.reduce((sum, r) => sum + (r.sleepTime + r.napTime), 0) / dayRecords.length / 60;
    const avgTossing = dayRecords.reduce((sum, r) => sum + r.tossingCount, 0) / dayRecords.length;
    const qualityToScore = (quality: 'excellent' | 'good' | 'fair' | 'poor') => {
      switch (quality) {
        case 'excellent': return 95;
        case 'good': return 80;
        case 'fair': return 60;
        case 'poor': return 40;
      }
    };
    const avgQuality = dayRecords.reduce((sum, r) => sum + qualityToScore(r.sleepQuality), 0) / dayRecords.length;
    const totalEvents = dayRecords.reduce((sum, r) => sum + r.events.length, 0);
    
    return { avgSleep, avgTossing, avgQuality, totalEvents };
  };

  const stats = getStats();

  // 그래프 화면
  if (showGraphs) {
    return (
      <div className="space-y-3">
        {/* 분석 기간 선택 */}
        <Card className="p-3 bg-purple-50 border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-purple-400" />
              <h3 className="text-purple-500">분석 기간</h3>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-sm">기간</Label>
              <Select value={analysisRange} onValueChange={(value: 'daily' | 'weekly' | 'monthly') => setAnalysisRange(value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">일간</SelectItem>
                  <SelectItem value="weekly">주간</SelectItem>
                  <SelectItem value="monthly">월간</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm">시작 날짜</Label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
        </Card>

        {/* AI 분석 버튼 */}
        <Card 
          className="p-3 bg-gradient-to-r from-purple-100 to-indigo-100 border-purple-200 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => setShowGraphs(false)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Brain className="w-5 h-5 mr-2 text-purple-500" />
              <div>
                <h3 className="text-purple-600">AI 분석</h3>
                <p className="text-xs text-purple-500">상세한 수면 분석 리포트 보기</p>
              </div>
            </div>
            <div className="text-purple-400">‹</div>
          </div>
        </Card>

        {/* 분석 그래프 */}
        <Card className="p-3 border-purple-100">
          <div className="flex items-center justify-between mb-3">
            <h3>분석 그래프</h3>
            <Badge className="bg-purple-100 text-purple-500">
              {analysisRange === 'daily' ? '일간' : analysisRange === 'weekly' ? '주간' : '월간'}
            </Badge>
          </div>
          
          {/* 수면 시간 추이 */}
          <div className="mb-5">
            <h4 className="mb-2 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 mr-2 text-purple-400" />
              수면 시간 추이 (수면+낮잠)
            </h4>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sleepTimeData}>
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip formatter={(value) => [`${value}시간`, '수면시간']} />
                  <Line 
                    type="monotone" 
                    dataKey="hours" 
                    stroke="#8b5cf6" 
                    strokeWidth={2}
                    dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 뒤척임 추이 */}
          <div className="mb-5">
            <h4 className="mb-2 flex items-center text-sm">
              <Activity className="w-4 h-4 mr-2 text-indigo-400" />
              뒤척임 추이
            </h4>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={tossingData}>
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip formatter={(value) => [`${value}회`, '뒤척임']} />
                  <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 수면 질 분석 추이 */}
          <div>
            <h4 className="mb-2 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 mr-2 text-green-400" />
              수면 질 분석 추이
            </h4>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sleepQualityData}>
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip formatter={(value) => [`${value}점`, '수면 품질']} />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    dot={{ fill: '#10b981', strokeWidth: 2, r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>

        {/* 통계 요약 */}
        <Card className="p-3 bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
          <h3 className="mb-2 text-purple-500">기간 내 통계</h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white rounded-lg p-2 text-center">
              <p className="text-xs text-gray-600 mb-1">평균 수면시간</p>
              <p className="text-purple-500">
                {Math.round(stats.avgSleep * 10) / 10}시간
              </p>
            </div>
            <div className="bg-white rounded-lg p-2 text-center">
              <p className="text-xs text-gray-600 mb-1">평균 뒤척임</p>
              <p className="text-indigo-500">
                {Math.round(stats.avgTossing)}회
              </p>
            </div>
            <div className="bg-white rounded-lg p-2 text-center">
              <p className="text-xs text-gray-600 mb-1">평균 수면 품질</p>
              <p className="text-green-500">
                {Math.round(stats.avgQuality)}점
              </p>
            </div>
            <div className="bg-white rounded-lg p-2 text-center">
              <p className="text-xs text-gray-600 mb-1">총 이벤트</p>
              <p className="text-orange-500">
                {stats.totalEvents}건
              </p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // 기본 화면 - AI 분석
  return (
    <div className="space-y-3">
      {/* 분석 기간 선택 */}
      <Card className="p-3 bg-purple-50 border-purple-200">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2 text-purple-400" />
            <h3 className="text-purple-500">분석 기간</h3>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-sm">기간</Label>
            <Select value={analysisRange} onValueChange={(value: 'daily' | 'weekly' | 'monthly') => setAnalysisRange(value)}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">일간</SelectItem>
                <SelectItem value="weekly">주간</SelectItem>
                <SelectItem value="monthly">월간</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-sm">시작 날짜</Label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-1"
            />
          </div>
        </div>
      </Card>

      {/* AI 분석 카드 */}
      <Card className="p-3 bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
        <div className="flex items-center mb-3">
          <Brain className="w-5 h-5 mr-2 text-purple-400" />
          <h2 className="text-purple-500">AI 수면 분석 리포트</h2>
        </div>
        
        <div className="bg-white rounded-lg p-3 mb-2">
          <p className="text-sm text-purple-600">{aiAnalysis.summary}</p>
        </div>

        {/* 수면 패턴 분석 */}
        <div className="space-y-2">
          <h3 className="flex items-center">
            <TrendingUp className="w-4 h-4 mr-2 text-blue-400" />
            수면 패턴 분석
          </h3>
          <div className="bg-blue-50 rounded-lg p-3 space-y-1.5">
            {aiAnalysis.sleepPattern.map((pattern, index) => (
              <p key={index} className="text-xs text-blue-700">• {pattern}</p>
            ))}
          </div>
        </div>

        {/* 우려사항 */}
        {aiAnalysis.concerns.length > 0 && (
          <div className="space-y-2 mt-3">
            <h3 className="flex items-center">
              <AlertTriangle className="w-4 h-4 mr-2 text-orange-600" />
              주의사항
            </h3>
            <div className="space-y-2">
              {aiAnalysis.concerns.map((concern, index) => (
                <div 
                  key={index}
                  className={`p-3 rounded-lg border-l-4 ${
                    concern.type === 'danger' ? 'bg-red-50 border-red-400' : 'bg-yellow-50 border-yellow-400'
                  }`}
                >
                  <h4 className={`mb-1 text-sm ${concern.type === 'danger' ? 'text-red-800' : 'text-yellow-800'}`}>
                    {concern.title}
                  </h4>
                  <p className={`text-xs ${concern.type === 'danger' ? 'text-red-700' : 'text-yellow-700'}`}>
                    {concern.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 권장사항 */}
        <div className="space-y-2 mt-3">
          <h3 className="flex items-center">
            <Lightbulb className="w-4 h-4 mr-2 text-green-600" />
            개선 권장사항
          </h3>
          <div className="bg-green-50 rounded-lg p-3 space-y-1.5">
            {aiAnalysis.recommendations.map((recommendation, index) => (
              <p key={index} className="text-xs text-green-700">• {recommendation}</p>
            ))}
          </div>
        </div>

        {/* 추가 정보 */}
        <div className="mt-3 p-2.5 bg-purple-50 rounded-lg">
          <p className="text-xs text-purple-600">
            💡 이 분석은 AI가 수면 데이터를 기반으로 생성한 것입니다. 
            지속적인 문제가 있다면 전문가와 상담하세요.
          </p>
        </div>
      </Card>

      {/* 분석 그래프 버튼 */}
      <Card 
        className="p-3 bg-gradient-to-r from-purple-100 to-indigo-100 border-purple-200 cursor-pointer hover:shadow-lg transition-shadow"
        onClick={() => setShowGraphs(true)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Activity className="w-5 h-5 mr-2 text-purple-500" />
            <div>
              <h3 className="text-purple-600">분석 그래프</h3>
              <p className="text-xs text-purple-500">수면 시간, 뒤척임, 수면 질 추이 그래프 보기</p>
            </div>
          </div>
          <div className="text-purple-400">›</div>
        </div>
      </Card>
    </div>
  );
}
