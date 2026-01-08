'use client';

import { useState, useMemo } from 'react';
import { useTranslatedTexts } from '@/lib/use-translations';

export default function AgeCalculator() {
  const [birthDate, setBirthDate] = useState<string>('2000-01-01');
  const [targetDate, setTargetDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  const [
    // Date format parts (0-2)
    year, month, dayLabel,
    // Days of week (3-9)
    sunday, monday, tuesday, wednesday, thursday, friday, saturday,
    // Suffix (10)
    dayOfWeekSuffix,
    // Zodiac signs (11-22)
    capricorn, aquarius, pisces, aries, taurus, gemini, cancer, leo, virgo, libra, scorpio, sagittarius,
    // Chinese zodiac (23-34)
    rat, ox, tiger, rabbit, dragon, snake, horse, sheep, monkey, rooster, dog, pig,
    // Labels (35-54)
    birthDateLabel, targetDateLabel, setToday,
    koreanAgeLabel, countingAgeLabel, ageSuffix,
    internationalStandard, koreanTraditional,
    daysLabel, weeksLabel, monthsLabel, hoursLabel,
    nextBirthdayLabel, specialDays,
    day100Label, day1000Label, day10000Label,
    zodiacSignLabel, zodiacAnimalLabel,
    detailInfo, totalMinutesLabel, totalSecondsLabel,
    minuteSuffix, secondSuffix, bornDayOfWeek,
    errorMessage
  ] = useTranslatedTexts([
    // Date format parts
    '년', '월', '일',
    // Days of week
    '일', '월', '화', '수', '목', '금', '토',
    // Suffix
    '요일',
    // Zodiac signs
    '염소자리', '물병자리', '물고기자리', '양자리', '황소자리', '쌍둥이자리',
    '게자리', '사자자리', '처녀자리', '천칭자리', '전갈자리', '사수자리',
    // Chinese zodiac
    '쥐띠', '소띠', '호랑이띠', '토끼띠', '용띠', '뱀띠',
    '말띠', '양띠', '원숭이띠', '닭띠', '개띠', '돼지띠',
    // Labels
    '🎂 생년월일', '📅 기준일', '오늘 날짜로 설정',
    '만 나이', '세는 나이', '세',
    '(국제 표준)', '(한국 전통)',
    '일', '주', '개월', '시간',
    '🎉 다음 생일까지', '🎊 특별한 기념일',
    '100일', '1,000일', '10,000일',
    '별자리', '띠',
    '📊 상세 정보', '총 분', '총 초',
    '분', '초', '태어난 요일',
    '⚠️ 생년월일은 기준일보다 이전이어야 합니다'
  ]);

  function formatDate(date: Date): string {
    return `${date.getFullYear()}${year} ${date.getMonth() + 1}${month} ${date.getDate()}${dayLabel}`;
  }

  function getDayOfWeek(date: Date): string {
    const days = [sunday, monday, tuesday, wednesday, thursday, friday, saturday];
    return days[date.getDay()];
  }

  function getZodiacSign(monthNum: number, day: number): { name: string; icon: string } {
    const signs = [
      { name: capricorn, icon: '♑', startMonth: 12, startDay: 22, endMonth: 1, endDay: 19 },
      { name: aquarius, icon: '♒', startMonth: 1, startDay: 20, endMonth: 2, endDay: 18 },
      { name: pisces, icon: '♓', startMonth: 2, startDay: 19, endMonth: 3, endDay: 20 },
      { name: aries, icon: '♈', startMonth: 3, startDay: 21, endMonth: 4, endDay: 19 },
      { name: taurus, icon: '♉', startMonth: 4, startDay: 20, endMonth: 5, endDay: 20 },
      { name: gemini, icon: '♊', startMonth: 5, startDay: 21, endMonth: 6, endDay: 21 },
      { name: cancer, icon: '♋', startMonth: 6, startDay: 22, endMonth: 7, endDay: 22 },
      { name: leo, icon: '♌', startMonth: 7, startDay: 23, endMonth: 8, endDay: 22 },
      { name: virgo, icon: '♍', startMonth: 8, startDay: 23, endMonth: 9, endDay: 22 },
      { name: libra, icon: '♎', startMonth: 9, startDay: 23, endMonth: 10, endDay: 22 },
      { name: scorpio, icon: '♏', startMonth: 10, startDay: 23, endMonth: 11, endDay: 21 },
      { name: sagittarius, icon: '♐', startMonth: 11, startDay: 22, endMonth: 12, endDay: 21 },
    ];

    for (const sign of signs) {
      if (sign.startMonth === 12) {
        if ((monthNum === 12 && day >= sign.startDay) || (monthNum === 1 && day <= sign.endDay)) {
          return { name: sign.name, icon: sign.icon };
        }
      } else {
        if ((monthNum === sign.startMonth && day >= sign.startDay) || 
            (monthNum === sign.endMonth && day <= sign.endDay)) {
          return { name: sign.name, icon: sign.icon };
        }
      }
    }
    return { name: capricorn, icon: '♑' };
  }

  function getZodiacAnimal(yearNum: number): { name: string; icon: string } {
    const animals = [
      { name: rat, icon: '🐭' },
      { name: ox, icon: '🐮' },
      { name: tiger, icon: '🐯' },
      { name: rabbit, icon: '🐰' },
      { name: dragon, icon: '🐲' },
      { name: snake, icon: '🐍' },
      { name: horse, icon: '🐴' },
      { name: sheep, icon: '🐑' },
      { name: monkey, icon: '🐵' },
      { name: rooster, icon: '🐔' },
      { name: dog, icon: '🐶' },
      { name: pig, icon: '🐷' },
    ];
    return animals[(yearNum - 4) % 12];
  }

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
            {birthDateLabel}
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
            {targetDateLabel}
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
            {setToday}
          </button>
        </div>
      </div>

      {calculation && (
        <>
          {/* 메인 결과 */}
          <div className="bg-gradient-to-br from-ai-primary to-purple-600 rounded-2xl p-6 text-white">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-sm opacity-80 mb-1">{koreanAgeLabel}</p>
                <p className="text-5xl font-bold">{calculation.koreanAge}{ageSuffix}</p>
                <p className="text-xs opacity-70 mt-1">{internationalStandard}</p>
              </div>
              <div>
                <p className="text-sm opacity-80 mb-1">{countingAgeLabel}</p>
                <p className="text-5xl font-bold">{calculation.countingAge}{ageSuffix}</p>
                <p className="text-xs opacity-70 mt-1">{koreanTraditional}</p>
              </div>
            </div>
          </div>

          {/* 생후 기간 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-blue-600">{calculation.totalDays.toLocaleString()}</p>
              <p className="text-sm text-blue-700">{daysLabel}</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-green-600">{calculation.totalWeeks.toLocaleString()}</p>
              <p className="text-sm text-green-700">{weeksLabel}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-purple-600">{calculation.totalMonths.toLocaleString()}</p>
              <p className="text-sm text-purple-700">{monthsLabel}</p>
            </div>
            <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-pink-600">{calculation.totalHours.toLocaleString()}</p>
              <p className="text-sm text-pink-700">{hoursLabel}</p>
            </div>
          </div>

          {/* 다음 생일 */}
          <div className="bg-yellow-50 rounded-xl p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold text-yellow-800">{nextBirthdayLabel}</p>
                <p className="text-sm text-yellow-600">
                  {formatDate(calculation.nextBirthday)} ({getDayOfWeek(calculation.nextBirthday)}{dayOfWeekSuffix})
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-yellow-600">D-{calculation.daysToNextBirthday}</p>
              </div>
            </div>
          </div>

          {/* 기념일 */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-bold text-gray-700 mb-3">{specialDays}</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                <span className="text-gray-600">{day100Label}</span>
                <span className="font-medium">{formatDate(calculation.day100)}</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                <span className="text-gray-600">{day1000Label}</span>
                <span className="font-medium">{formatDate(calculation.day1000)}</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                <span className="text-gray-600">{day10000Label}</span>
                <span className="font-medium">{formatDate(calculation.day10000)}</span>
              </div>
            </div>
          </div>

          {/* 별자리 & 띠 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-indigo-50 rounded-xl p-4 text-center">
              <p className="text-4xl mb-2">{calculation.zodiacSign.icon}</p>
              <p className="font-bold text-indigo-700">{calculation.zodiacSign.name}</p>
              <p className="text-xs text-indigo-500">{zodiacSignLabel}</p>
            </div>
            <div className="bg-orange-50 rounded-xl p-4 text-center">
              <p className="text-4xl mb-2">{calculation.zodiacAnimal.icon}</p>
              <p className="font-bold text-orange-700">{calculation.zodiacAnimal.name}</p>
              <p className="text-xs text-orange-500">{zodiacAnimalLabel}</p>
            </div>
          </div>

          {/* 상세 정보 */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-bold text-gray-700 mb-3">{detailInfo}</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex justify-between p-2 bg-white rounded-lg">
                <span className="text-gray-500">{totalMinutesLabel}</span>
                <span className="font-medium">{calculation.totalMinutes.toLocaleString()}{minuteSuffix}</span>
              </div>
              <div className="flex justify-between p-2 bg-white rounded-lg">
                <span className="text-gray-500">{totalSecondsLabel}</span>
                <span className="font-medium">{calculation.totalSeconds.toLocaleString()}{secondSuffix}</span>
              </div>
              <div className="flex justify-between p-2 bg-white rounded-lg col-span-2">
                <span className="text-gray-500">{bornDayOfWeek}</span>
                <span className="font-medium">{getDayOfWeek(calculation.birthDate)}{dayOfWeekSuffix}</span>
              </div>
            </div>
          </div>
        </>
      )}

      {/* 에러 */}
      {!calculation && birthDate && targetDate && (
        <div className="bg-red-50 rounded-xl p-4 text-center text-red-600">
          {errorMessage}
        </div>
      )}
    </div>
  );
}
