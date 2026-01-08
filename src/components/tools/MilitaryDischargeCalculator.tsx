'use client';

import { useState, useMemo } from 'react';
import { useTranslatedTexts } from '@/lib/use-translations';

type MilitaryBranch = 'army' | 'navy' | 'airforce' | 'marine' | 'socialservice';

interface MilitaryInfo {
  nameKey: string;
  icon: string;
  serviceDays: number;
  ranks: { nameKey: string; daysFromStart: number }[];
}

const MILITARY_INFO: Record<MilitaryBranch, MilitaryInfo> = {
  army: {
    nameKey: '육군',
    icon: '🪖',
    serviceDays: 548, // 18개월
    ranks: [
      { nameKey: '이등병', daysFromStart: 0 },
      { nameKey: '일등병', daysFromStart: 60 },
      { nameKey: '상등병', daysFromStart: 180 },
      { nameKey: '병장', daysFromStart: 360 },
    ],
  },
  navy: {
    nameKey: '해군',
    icon: '⚓',
    serviceDays: 600, // 20개월
    ranks: [
      { nameKey: '이등병', daysFromStart: 0 },
      { nameKey: '일등병', daysFromStart: 60 },
      { nameKey: '상등병', daysFromStart: 180 },
      { nameKey: '병장', daysFromStart: 360 },
    ],
  },
  airforce: {
    nameKey: '공군',
    icon: '✈️',
    serviceDays: 639, // 21개월
    ranks: [
      { nameKey: '이등병', daysFromStart: 0 },
      { nameKey: '일등병', daysFromStart: 60 },
      { nameKey: '상등병', daysFromStart: 180 },
      { nameKey: '병장', daysFromStart: 360 },
    ],
  },
  marine: {
    nameKey: '해병대',
    icon: '🦅',
    serviceDays: 548, // 18개월
    ranks: [
      { nameKey: '이등병', daysFromStart: 0 },
      { nameKey: '일등병', daysFromStart: 60 },
      { nameKey: '상등병', daysFromStart: 180 },
      { nameKey: '병장', daysFromStart: 360 },
    ],
  },
  socialservice: {
    nameKey: '사회복무요원',
    icon: '🏢',
    serviceDays: 639, // 21개월
    ranks: [
      { nameKey: '소집해제 예정', daysFromStart: 0 },
    ],
  },
};

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
  const [
    t육군,
    t해군,
    t공군,
    t해병대,
    t사회복무요원,
    t이등병,
    t일등병,
    t상등병,
    t병장,
    t소집해제예정,
    t입대일선택,
    t복무기간,
    t개월,
    t일,
    t전역완료,
    t입대예정일,
    t전역예정일,
    t요일,
    t복무현황,
    t복무진행률,
    t입대,
    t전역,
    t복무한일수,
    t남은일수,
    t현재계급,
    t다음진급까지,
    t진급예정일,
    t현재,
    t입대까지,
    t일남았어요,
    t전역을축하합니다,
    t전역한지,
    t일이지났어요,
    t참고사항,
    t참고1,
    t참고2,
    t참고3,
    t년,
    t월,
    t일자,
    t일요일,
    t월요일,
    t화요일,
    t수요일,
    t목요일,
    t금요일,
    t토요일,
  ] = useTranslatedTexts([
    '육군',
    '해군',
    '공군',
    '해병대',
    '사회복무요원',
    '이등병',
    '일등병',
    '상등병',
    '병장',
    '소집해제 예정',
    '📅 입대일 선택',
    '복무기간',
    '개월',
    '일',
    '🎉 전역 완료!',
    '입대 예정일',
    '🎖️ 전역 예정일',
    '요일',
    '📊 복무 현황',
    '복무 진행률',
    '입대',
    '전역',
    '복무한 일수',
    '남은 일수',
    '현재 계급',
    '다음 진급까지',
    '🎖️ 진급 예정일',
    '현재',
    '입대까지',
    '일 남았어요',
    '전역을 축하합니다!',
    '전역한 지',
    '일이 지났어요',
    '💡 참고사항',
    '복무기간은 2025년 기준이며, 정책 변경 시 달라질 수 있어요',
    '실제 전역일은 휴가, 위로휴가 등에 따라 달라질 수 있어요',
    '진급일은 일반적인 기준이며, 부대 사정에 따라 다를 수 있어요',
    '년',
    '월',
    '일',
    '일요일',
    '월요일',
    '화요일',
    '수요일',
    '목요일',
    '금요일',
    '토요일',
  ]);

  const branchNames: Record<MilitaryBranch, string> = {
    army: t육군,
    navy: t해군,
    airforce: t공군,
    marine: t해병대,
    socialservice: t사회복무요원,
  };

  const rankNames: Record<string, string> = {
    '이등병': t이등병,
    '일등병': t일등병,
    '상등병': t상등병,
    '병장': t병장,
    '소집해제 예정': t소집해제예정,
  };

  const dayOfWeekNames = [t일요일, t월요일, t화요일, t수요일, t목요일, t금요일, t토요일];

  const formatDate = (date: Date): string => {
    return `${date.getFullYear()}${t년} ${date.getMonth() + 1}${t월} ${date.getDate()}${t일자}`;
  };

  const getDayOfWeek = (date: Date): string => {
    return dayOfWeekNames[date.getDay()];
  };

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
            <span className="font-medium text-gray-700 text-sm">{branchNames[key]}</span>
          </button>
        ))}
      </div>

      {/* 입대일 입력 */}
      <div className="bg-gray-50 rounded-2xl p-5">
        <label className="block font-semibold text-gray-700 mb-3">
          {t입대일선택}
        </label>
        <input
          type="date"
          value={enlistDate}
          onChange={(e) => setEnlistDate(e.target.value)}
          className="w-full p-4 text-xl text-center border-2 border-gray-200 rounded-xl focus:border-ai-primary focus:outline-none"
        />
        <p className="text-sm text-gray-500 mt-2 text-center">
          {branchNames[branch]} {t복무기간}: {Math.floor(militaryInfo.serviceDays / 30)}{t개월} ({militaryInfo.serviceDays}{t일})
        </p>
      </div>

      {calculation && (
        <>
          {/* 전역일 결과 */}
          <div className="bg-gradient-to-br from-ai-primary to-purple-600 rounded-2xl p-6 text-white text-center">
            <p className="text-lg opacity-90 mb-2">
              {calculation.isDischarged ? t전역완료 : calculation.isBeforeEnlist ? t입대예정일 : t전역예정일}
            </p>
            <p className="text-4xl font-bold">
              {formatDate(calculation.dischargeDate)}
            </p>
            <p className="text-lg opacity-80 mt-1">
              ({getDayOfWeek(calculation.dischargeDate)})
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
              <h3 className="font-bold text-gray-800">{t복무현황}</h3>
              
              {/* 진행바 */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">{t복무진행률}</span>
                  <span className="font-bold text-ai-primary">{calculation.progressPercent.toFixed(1)}%</span>
                </div>
                <div className="h-6 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-ai-primary to-purple-500 transition-all flex items-center justify-end pr-2"
                    style={{ width: `${Math.max(calculation.progressPercent, 5)}%` }}
                  >
                    <span className="text-xs text-white font-medium">
                      {rankNames[calculation.currentRank.nameKey]}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{t입대} ({formatDate(calculation.enlistDate)})</span>
                  <span>{t전역}</span>
                </div>
              </div>

              {/* 복무일수 */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-4 text-center">
                  <p className="text-3xl font-bold text-green-600">{calculation.servedDays}</p>
                  <p className="text-sm text-gray-500">{t복무한일수}</p>
                </div>
                <div className="bg-white rounded-xl p-4 text-center">
                  <p className="text-3xl font-bold text-blue-600">{calculation.remainingDays}</p>
                  <p className="text-sm text-gray-500">{t남은일수}</p>
                </div>
              </div>

              {/* 현재 계급 */}
              {branch !== 'socialservice' && (
                <div className="bg-white rounded-xl p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500">{t현재계급}</p>
                      <p className="text-xl font-bold text-gray-800">{rankNames[calculation.currentRank.nameKey]}</p>
                    </div>
                    {calculation.nextRank && (
                      <div className="text-right">
                        <p className="text-sm text-gray-500">{t다음진급까지}</p>
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
              <h3 className="font-bold text-gray-700 mb-3">{t진급예정일}</h3>
              <div className="space-y-2">
                {calculation.promotionDates.map((rank, index) => {
                  const isPast = new Date() >= rank.date;
                  const isCurrent = calculation.currentRank.nameKey === rank.nameKey;
                  
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
                          {rankNames[rank.nameKey]}
                        </span>
                        {isCurrent && <span className="text-xs bg-ai-primary text-white px-2 py-0.5 rounded-full">{t현재}</span>}
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
                {t입대까지} <span className="font-bold text-xl">D{daysBetween(new Date(), calculation.enlistDate)}</span> {t일남았어요}
              </p>
            </div>
          )}

          {/* 전역 완료 */}
          {calculation.isDischarged && (
            <div className="bg-green-50 rounded-xl p-4 text-center">
              <p className="text-5xl mb-2">🎉</p>
              <p className="text-green-800 font-bold text-xl">
                {t전역을축하합니다}
              </p>
              <p className="text-green-600 mt-2">
                {t전역한지} {Math.abs(calculation.remainingDays)}{t일이지났어요}
              </p>
            </div>
          )}
        </>
      )}

      {/* 안내 */}
      <div className="bg-gray-50 rounded-xl p-4">
        <h3 className="font-bold text-gray-700 mb-2">{t참고사항}</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• {t참고1}</li>
          <li>• {t참고2}</li>
          <li>• {t참고3}</li>
        </ul>
      </div>
    </div>
  );
}
