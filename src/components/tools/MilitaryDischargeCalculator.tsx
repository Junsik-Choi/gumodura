'use client';

import { useState, useMemo } from 'react';

type MilitaryBranch = 'army' | 'navy' | 'airforce' | 'marine' | 'socialservice';

interface MilitaryInfo {
  name: string;
  icon: string;
  serviceDays: number;
  ranks: { name: string; daysFromStart: number }[];
}

const MILITARY_INFO: Record<MilitaryBranch, MilitaryInfo> = {
  army: {
    name: '육군',
    icon: '🪖',
    serviceDays: 548, // 18개월
    ranks: [
      { name: '이등병', daysFromStart: 0 },
      { name: '일등병', daysFromStart: 60 },
      { name: '상등병', daysFromStart: 180 },
      { name: '병장', daysFromStart: 360 },
    ],
  },
  navy: {
    name: '해군',
    icon: '⚓',
    serviceDays: 600, // 20개월
    ranks: [
      { name: '이등병', daysFromStart: 0 },
      { name: '일등병', daysFromStart: 60 },
      { name: '상등병', daysFromStart: 180 },
      { name: '병장', daysFromStart: 360 },
    ],
  },
  airforce: {
    name: '공군',
    icon: '✈️',
    serviceDays: 639, // 21개월
    ranks: [
      { name: '이등병', daysFromStart: 0 },
      { name: '일등병', daysFromStart: 60 },
      { name: '상등병', daysFromStart: 180 },
      { name: '병장', daysFromStart: 360 },
    ],
  },
  marine: {
    name: '해병대',
    icon: '🦅',
    serviceDays: 548, // 18개월
    ranks: [
      { name: '이등병', daysFromStart: 0 },
      { name: '일등병', daysFromStart: 60 },
      { name: '상등병', daysFromStart: 180 },
      { name: '병장', daysFromStart: 360 },
    ],
  },
  socialservice: {
    name: '사회복무요원',
    icon: '🏢',
    serviceDays: 639, // 21개월
    ranks: [
      { name: '소집해제 예정', daysFromStart: 0 },
    ],
  },
};

function formatDate(date: Date): string {
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
}

function getDayOfWeek(date: Date): string {
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  return days[date.getDay()];
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function daysBetween(date1: Date, date2: Date): number {
  const oneDay = 24 * 60 * 60 * 1000;
  return Math.round((date2.getTime() - date1.getTime()) / oneDay);
}

export default function MilitaryDischargeCalculator() {
  const [enlistDate, setEnlistDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [branch, setBranch] = useState<MilitaryBranch>('army');

  const militaryInfo = MILITARY_INFO[branch];

  const calculation = useMemo(() => {
    const enlist = new Date(enlistDate);
    if (isNaN(enlist.getTime())) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dischargeDate = addDays(enlist, militaryInfo.serviceDays - 1);
    const servedDays = daysBetween(enlist, today);
    const remainingDays = daysBetween(today, dischargeDate);
    const progressPercent = Math.min(100, Math.max(0, (servedDays / militaryInfo.serviceDays) * 100));

    // 현재 계급 계산
    let currentRank = militaryInfo.ranks[0];
    let nextRank: typeof currentRank | null = null;
    let daysToNextRank = 0;

    for (let i = 0; i < militaryInfo.ranks.length; i++) {
      if (servedDays >= militaryInfo.ranks[i].daysFromStart) {
        currentRank = militaryInfo.ranks[i];
        if (i + 1 < militaryInfo.ranks.length) {
          nextRank = militaryInfo.ranks[i + 1];
          daysToNextRank = nextRank.daysFromStart - servedDays;
        }
      }
    }

    // 진급일 계산
    const promotionDates = militaryInfo.ranks.map(rank => ({
      ...rank,
      date: addDays(enlist, rank.daysFromStart),
    }));

    return {
      enlistDate: enlist,
      dischargeDate,
      servedDays: Math.max(0, servedDays),
      remainingDays: Math.max(0, remainingDays),
      progressPercent,
      currentRank,
      nextRank,
      daysToNextRank: Math.max(0, daysToNextRank),
      promotionDates,
      isServing: servedDays >= 0 && remainingDays > 0,
      isDischarged: remainingDays <= 0,
      isBeforeEnlist: servedDays < 0,
    };
  }, [enlistDate, militaryInfo]);

  return (
    <div className="space-y-6">
      {/* 군별 선택 */}
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
        {(Object.entries(MILITARY_INFO) as [MilitaryBranch, MilitaryInfo][]).map(([key, info]) => (
          <button
            key={key}
            onClick={() => setBranch(key)}
            className={`p-3 rounded-xl border-2 transition-all text-center ${
              branch === key
                ? 'border-ai-primary bg-ai-primary/10'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <span className="text-2xl block mb-1">{info.icon}</span>
            <span className="font-medium text-gray-700 text-sm">{info.name}</span>
          </button>
        ))}
      </div>

      {/* 입대일 입력 */}
      <div className="bg-gray-50 rounded-2xl p-5">
        <label className="block font-semibold text-gray-700 mb-3">
          📅 입대일 선택
        </label>
        <input
          type="date"
          value={enlistDate}
          onChange={(e) => setEnlistDate(e.target.value)}
          className="w-full p-4 text-xl text-center border-2 border-gray-200 rounded-xl focus:border-ai-primary focus:outline-none"
        />
        <p className="text-sm text-gray-500 mt-2 text-center">
          {militaryInfo.name} 복무기간: {Math.floor(militaryInfo.serviceDays / 30)}개월 ({militaryInfo.serviceDays}일)
        </p>
      </div>

      {calculation && (
        <>
          {/* 전역일 결과 */}
          <div className="bg-gradient-to-br from-ai-primary to-purple-600 rounded-2xl p-6 text-white text-center">
            <p className="text-lg opacity-90 mb-2">
              {calculation.isDischarged ? '🎉 전역 완료!' : calculation.isBeforeEnlist ? '입대 예정일' : '🎖️ 전역 예정일'}
            </p>
            <p className="text-4xl font-bold">
              {formatDate(calculation.dischargeDate)}
            </p>
            <p className="text-lg opacity-80 mt-1">
              ({getDayOfWeek(calculation.dischargeDate)}요일)
            </p>
            
            {calculation.isServing && (
              <div className="mt-4 pt-4 border-t border-white/20">
                <p className="text-lg">
                  D-{calculation.remainingDays}
                </p>
              </div>
            )}
          </div>

          {/* 복무 현황 */}
          {calculation.isServing && (
            <div className="bg-gray-50 rounded-2xl p-5 space-y-4">
              <h3 className="font-bold text-gray-800">📊 복무 현황</h3>
              
              {/* 진행바 */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">복무 진행률</span>
                  <span className="font-bold text-ai-primary">{calculation.progressPercent.toFixed(1)}%</span>
                </div>
                <div className="h-6 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-ai-primary to-purple-500 transition-all flex items-center justify-end pr-2"
                    style={{ width: `${Math.max(calculation.progressPercent, 5)}%` }}
                  >
                    <span className="text-xs text-white font-medium">
                      {calculation.currentRank.name}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>입대 ({formatDate(calculation.enlistDate)})</span>
                  <span>전역</span>
                </div>
              </div>

              {/* 복무일수 */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-4 text-center">
                  <p className="text-3xl font-bold text-green-600">{calculation.servedDays}</p>
                  <p className="text-sm text-gray-500">복무한 일수</p>
                </div>
                <div className="bg-white rounded-xl p-4 text-center">
                  <p className="text-3xl font-bold text-blue-600">{calculation.remainingDays}</p>
                  <p className="text-sm text-gray-500">남은 일수</p>
                </div>
              </div>

              {/* 현재 계급 */}
              {branch !== 'socialservice' && (
                <div className="bg-white rounded-xl p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500">현재 계급</p>
                      <p className="text-xl font-bold text-gray-800">{calculation.currentRank.name}</p>
                    </div>
                    {calculation.nextRank && (
                      <div className="text-right">
                        <p className="text-sm text-gray-500">다음 진급까지</p>
                        <p className="text-lg font-bold text-ai-primary">D-{calculation.daysToNextRank}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 진급일 정보 */}
          {branch !== 'socialservice' && (
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-bold text-gray-700 mb-3">🎖️ 진급 예정일</h3>
              <div className="space-y-2">
                {calculation.promotionDates.map((rank, index) => {
                  const isPast = new Date() >= rank.date;
                  const isCurrent = calculation.currentRank.name === rank.name;
                  
                  return (
                    <div
                      key={index}
                      className={`flex justify-between items-center p-3 rounded-lg ${
                        isCurrent ? 'bg-ai-primary/10 border-2 border-ai-primary' : 
                        isPast ? 'bg-green-50' : 'bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {isPast ? '✅' : '⏳'}
                        <span className={`font-medium ${isCurrent ? 'text-ai-primary' : 'text-gray-700'}`}>
                          {rank.name}
                        </span>
                        {isCurrent && <span className="text-xs bg-ai-primary text-white px-2 py-0.5 rounded-full">현재</span>}
                      </div>
                      <span className="text-gray-600">
                        {formatDate(rank.date)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 입대 전 */}
          {calculation.isBeforeEnlist && (
            <div className="bg-yellow-50 rounded-xl p-4 text-center">
              <p className="text-yellow-800">
                입대까지 <span className="font-bold text-xl">D{daysBetween(new Date(), calculation.enlistDate)}</span>일 남았어요
              </p>
            </div>
          )}

          {/* 전역 완료 */}
          {calculation.isDischarged && (
            <div className="bg-green-50 rounded-xl p-4 text-center">
              <p className="text-5xl mb-2">🎉</p>
              <p className="text-green-800 font-bold text-xl">
                전역을 축하합니다!
              </p>
              <p className="text-green-600 mt-2">
                전역한 지 {Math.abs(calculation.remainingDays)}일이 지났어요
              </p>
            </div>
          )}
        </>
      )}

      {/* 안내 */}
      <div className="bg-gray-50 rounded-xl p-4">
        <h3 className="font-bold text-gray-700 mb-2">💡 참고사항</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• 복무기간은 2025년 기준이며, 정책 변경 시 달라질 수 있어요</li>
          <li>• 실제 전역일은 휴가, 위로휴가 등에 따라 달라질 수 있어요</li>
          <li>• 진급일은 일반적인 기준이며, 부대 사정에 따라 다를 수 있어요</li>
        </ul>
      </div>
    </div>
  );
}
