'use client';

import { useState, useMemo } from 'react';

function formatDate(date: Date): string {
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
}

function getDayOfWeek(date: Date): string {
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  return days[date.getDay()];
}

function getZodiacSign(month: number, day: number): { name: string; icon: string } {
  const signs = [
    { name: '염소자리', icon: '♑', startMonth: 12, startDay: 22, endMonth: 1, endDay: 19 },
    { name: '물병자리', icon: '♒', startMonth: 1, startDay: 20, endMonth: 2, endDay: 18 },
    { name: '물고기자리', icon: '♓', startMonth: 2, startDay: 19, endMonth: 3, endDay: 20 },
    { name: '양자리', icon: '♈', startMonth: 3, startDay: 21, endMonth: 4, endDay: 19 },
    { name: '황소자리', icon: '♉', startMonth: 4, startDay: 20, endMonth: 5, endDay: 20 },
    { name: '쌍둥이자리', icon: '♊', startMonth: 5, startDay: 21, endMonth: 6, endDay: 21 },
    { name: '게자리', icon: '♋', startMonth: 6, startDay: 22, endMonth: 7, endDay: 22 },
    { name: '사자자리', icon: '♌', startMonth: 7, startDay: 23, endMonth: 8, endDay: 22 },
    { name: '처녀자리', icon: '♍', startMonth: 8, startDay: 23, endMonth: 9, endDay: 22 },
    { name: '천칭자리', icon: '♎', startMonth: 9, startDay: 23, endMonth: 10, endDay: 22 },
    { name: '전갈자리', icon: '♏', startMonth: 10, startDay: 23, endMonth: 11, endDay: 21 },
    { name: '사수자리', icon: '♐', startMonth: 11, startDay: 22, endMonth: 12, endDay: 21 },
  ];

  for (const sign of signs) {
    if (sign.startMonth === 12) {
      if ((month === 12 && day >= sign.startDay) || (month === 1 && day <= sign.endDay)) {
        return { name: sign.name, icon: sign.icon };
      }
    } else {
      if ((month === sign.startMonth && day >= sign.startDay) || 
          (month === sign.endMonth && day <= sign.endDay)) {
        return { name: sign.name, icon: sign.icon };
      }
    }
  }
  return { name: '염소자리', icon: '♑' };
}

function getZodiacAnimal(year: number): { name: string; icon: string } {
  const animals = [
    { name: '쥐띠', icon: '🐭' },
    { name: '소띠', icon: '🐮' },
    { name: '호랑이띠', icon: '🐯' },
    { name: '토끼띠', icon: '🐰' },
    { name: '용띠', icon: '🐲' },
    { name: '뱀띠', icon: '🐍' },
    { name: '말띠', icon: '🐴' },
    { name: '양띠', icon: '🐑' },
    { name: '원숭이띠', icon: '🐵' },
    { name: '닭띠', icon: '🐔' },
    { name: '개띠', icon: '🐶' },
    { name: '돼지띠', icon: '🐷' },
  ];
  return animals[(year - 4) % 12];
}

export default function AgeCalculator() {
  const [birthDate, setBirthDate] = useState<string>('2000-01-01');
  const [targetDate, setTargetDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  const calculation = useMemo(() => {
    const birth = new Date(birthDate);
    const target = new Date(targetDate);
    
    if (isNaN(birth.getTime()) || isNaN(target.getTime())) return null;
    if (birth > target) return null;

    // 만 나이 계산
    let koreanAge = target.getFullYear() - birth.getFullYear();
    const birthThisYear = new Date(target.getFullYear(), birth.getMonth(), birth.getDate());
    if (target < birthThisYear) {
      koreanAge--;
    }

    // 세는 나이 (한국식)
    const countingAge = target.getFullYear() - birth.getFullYear() + 1;

    // 생후 일수
    const diffTime = target.getTime() - birth.getTime();
    const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    // 생후 주수
    const totalWeeks = Math.floor(totalDays / 7);

    // 생후 개월수
    let totalMonths = (target.getFullYear() - birth.getFullYear()) * 12;
    totalMonths += target.getMonth() - birth.getMonth();
    if (target.getDate() < birth.getDate()) {
      totalMonths--;
    }

    // 다음 생일까지
    let nextBirthday = new Date(target.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBirthday <= target) {
      nextBirthday = new Date(target.getFullYear() + 1, birth.getMonth(), birth.getDate());
    }
    const daysToNextBirthday = Math.ceil((nextBirthday.getTime() - target.getTime()) / (1000 * 60 * 60 * 24));

    // 100일, 1000일
    const day100 = new Date(birth.getTime() + 100 * 24 * 60 * 60 * 1000);
    const day1000 = new Date(birth.getTime() + 1000 * 24 * 60 * 60 * 1000);
    const day10000 = new Date(birth.getTime() + 10000 * 24 * 60 * 60 * 1000);

    // 시간 계산
    const totalHours = Math.floor(diffTime / (1000 * 60 * 60));
    const totalMinutes = Math.floor(diffTime / (1000 * 60));
    const totalSeconds = Math.floor(diffTime / 1000);

    // 별자리
    const zodiacSign = getZodiacSign(birth.getMonth() + 1, birth.getDate());
    
    // 띠
    const zodiacAnimal = getZodiacAnimal(birth.getFullYear());

    return {
      koreanAge,
      countingAge,
      totalDays,
      totalWeeks,
      totalMonths,
      totalHours,
      totalMinutes,
      totalSeconds,
      daysToNextBirthday,
      nextBirthday,
      day100,
      day1000,
      day10000,
      zodiacSign,
      zodiacAnimal,
      birthDate: birth,
    };
  }, [birthDate, targetDate]);

  return (
    <div className="space-y-6">
      {/* 입력 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-gray-50 rounded-xl p-4">
          <label className="block font-semibold text-gray-700 mb-2">
            🎂 생년월일
          </label>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            max={targetDate}
            className="w-full p-3 text-center border-2 border-gray-200 rounded-xl focus:border-ai-primary focus:outline-none"
          />
        </div>
        <div className="bg-gray-50 rounded-xl p-4">
          <label className="block font-semibold text-gray-700 mb-2">
            📅 기준일
          </label>
          <input
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            min={birthDate}
            className="w-full p-3 text-center border-2 border-gray-200 rounded-xl focus:border-ai-primary focus:outline-none"
          />
          <button
            onClick={() => setTargetDate(new Date().toISOString().split('T')[0])}
            className="w-full mt-2 py-2 text-sm text-ai-primary hover:bg-ai-primary/10 rounded-lg transition-colors"
          >
            오늘 날짜로 설정
          </button>
        </div>
      </div>

      {calculation && (
        <>
          {/* 메인 결과 */}
          <div className="bg-gradient-to-br from-ai-primary to-purple-600 rounded-2xl p-6 text-white">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-sm opacity-80 mb-1">만 나이</p>
                <p className="text-5xl font-bold">{calculation.koreanAge}세</p>
                <p className="text-xs opacity-70 mt-1">(국제 표준)</p>
              </div>
              <div>
                <p className="text-sm opacity-80 mb-1">세는 나이</p>
                <p className="text-5xl font-bold">{calculation.countingAge}세</p>
                <p className="text-xs opacity-70 mt-1">(한국 전통)</p>
              </div>
            </div>
          </div>

          {/* 생후 기간 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-blue-600">{calculation.totalDays.toLocaleString()}</p>
              <p className="text-sm text-blue-700">일</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-green-600">{calculation.totalWeeks.toLocaleString()}</p>
              <p className="text-sm text-green-700">주</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-purple-600">{calculation.totalMonths.toLocaleString()}</p>
              <p className="text-sm text-purple-700">개월</p>
            </div>
            <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-pink-600">{calculation.totalHours.toLocaleString()}</p>
              <p className="text-sm text-pink-700">시간</p>
            </div>
          </div>

          {/* 다음 생일 */}
          <div className="bg-yellow-50 rounded-xl p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold text-yellow-800">🎉 다음 생일까지</p>
                <p className="text-sm text-yellow-600">
                  {formatDate(calculation.nextBirthday)} ({getDayOfWeek(calculation.nextBirthday)}요일)
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-yellow-600">D-{calculation.daysToNextBirthday}</p>
              </div>
            </div>
          </div>

          {/* 기념일 */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-bold text-gray-700 mb-3">🎊 특별한 기념일</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                <span className="text-gray-600">100일</span>
                <span className="font-medium">{formatDate(calculation.day100)}</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                <span className="text-gray-600">1,000일</span>
                <span className="font-medium">{formatDate(calculation.day1000)}</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                <span className="text-gray-600">10,000일</span>
                <span className="font-medium">{formatDate(calculation.day10000)}</span>
              </div>
            </div>
          </div>

          {/* 별자리 & 띠 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-indigo-50 rounded-xl p-4 text-center">
              <p className="text-4xl mb-2">{calculation.zodiacSign.icon}</p>
              <p className="font-bold text-indigo-700">{calculation.zodiacSign.name}</p>
              <p className="text-xs text-indigo-500">별자리</p>
            </div>
            <div className="bg-orange-50 rounded-xl p-4 text-center">
              <p className="text-4xl mb-2">{calculation.zodiacAnimal.icon}</p>
              <p className="font-bold text-orange-700">{calculation.zodiacAnimal.name}</p>
              <p className="text-xs text-orange-500">띠</p>
            </div>
          </div>

          {/* 상세 정보 */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-bold text-gray-700 mb-3">📊 상세 정보</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex justify-between p-2 bg-white rounded-lg">
                <span className="text-gray-500">총 분</span>
                <span className="font-medium">{calculation.totalMinutes.toLocaleString()}분</span>
              </div>
              <div className="flex justify-between p-2 bg-white rounded-lg">
                <span className="text-gray-500">총 초</span>
                <span className="font-medium">{calculation.totalSeconds.toLocaleString()}초</span>
              </div>
              <div className="flex justify-between p-2 bg-white rounded-lg col-span-2">
                <span className="text-gray-500">태어난 요일</span>
                <span className="font-medium">{getDayOfWeek(calculation.birthDate)}요일</span>
              </div>
            </div>
          </div>
        </>
      )}

      {/* 에러 */}
      {!calculation && birthDate && targetDate && (
        <div className="bg-red-50 rounded-xl p-4 text-center text-red-600">
          ⚠️ 생년월일은 기준일보다 이전이어야 합니다
        </div>
      )}
    </div>
  );
}
