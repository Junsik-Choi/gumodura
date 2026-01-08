'use client';

import { useState, useMemo } from 'react';
import { useTranslatedTexts } from '@/lib/use-translations';

// 음력 변환을 위한 데이터 (1900-2100년)
// 간단한 변환 알고리즘 (정확도를 위해서는 별도 라이브러리 필요)
const LUNAR_INFO = [
  0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2,
  0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977,
  0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970,
  0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950,
  0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557,
  0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5b0, 0x14573, 0x052b0, 0x0a9a8, 0x0e950, 0x06aa0,
  0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0,
  0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b6a0, 0x195a6,
  0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570,
  0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x055c0, 0x0ab60, 0x096d5, 0x092e0,
  0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5,
  0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930,
  0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530,
  0x05aa0, 0x076a3, 0x096d0, 0x04afb, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45,
  0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0,
  0x14b63, 0x09370, 0x049f8, 0x04970, 0x064b0, 0x168a6, 0x0ea50, 0x06b20, 0x1a6c4, 0x0aae0,
  0x0a2e0, 0x0d2e3, 0x0c960, 0x0d557, 0x0d4a0, 0x0da50, 0x05d55, 0x056a0, 0x0a6d0, 0x055d4,
  0x052d0, 0x0a9b8, 0x0a950, 0x0b4a0, 0x0b6a6, 0x0ad50, 0x055a0, 0x0aba4, 0x0a5b0, 0x052b0,
  0x0b273, 0x06930, 0x07337, 0x06aa0, 0x0ad50, 0x14b55, 0x04b60, 0x0a570, 0x054e4, 0x0d160,
  0x0e968, 0x0d520, 0x0daa0, 0x16aa6, 0x056d0, 0x04ae0, 0x0a9d4, 0x0a2d0, 0x0d150, 0x0f252,
  0x0d520,
];

function getLunarYearDays(year: number): number {
  let sum = 348;
  for (let i = 0x8000; i > 0x8; i >>= 1) {
    sum += (LUNAR_INFO[year - 1900] & i) ? 1 : 0;
  }
  return sum + getLeapDays(year);
}

function getLeapMonth(year: number): number {
  return LUNAR_INFO[year - 1900] & 0xf;
}

function getLeapDays(year: number): number {
  if (getLeapMonth(year)) {
    return (LUNAR_INFO[year - 1900] & 0x10000) ? 30 : 29;
  }
  return 0;
}

function getLunarMonthDays(year: number, month: number): number {
  return (LUNAR_INFO[year - 1900] & (0x10000 >> month)) ? 30 : 29;
}

// 양력 -> 음력 변환
function solarToLunar(solarDate: Date): { year: number; month: number; day: number; isLeap: boolean } {
  const baseDate = new Date(1900, 0, 31);
  let offset = Math.floor((solarDate.getTime() - baseDate.getTime()) / 86400000);
  
  let year = 1900;
  let temp = 0;
  
  for (year = 1900; year < 2100 && offset > 0; year++) {
    temp = getLunarYearDays(year);
    offset -= temp;
  }
  
  if (offset < 0) {
    offset += temp;
    year--;
  }
  
  const leapMonth = getLeapMonth(year);
  let isLeap = false;
  let month = 1;
  
  for (month = 1; month < 13 && offset > 0; month++) {
    if (leapMonth > 0 && month === leapMonth + 1 && !isLeap) {
      --month;
      isLeap = true;
      temp = getLeapDays(year);
    } else {
      temp = getLunarMonthDays(year, month);
    }
    
    if (isLeap && month === leapMonth + 1) {
      isLeap = false;
    }
    
    offset -= temp;
  }
  
  if (offset < 0) {
    offset += temp;
    --month;
  }
  
  const day = offset + 1;
  
  return { year, month, day, isLeap };
}

// 음력 -> 양력 변환
function lunarToSolar(lunarYear: number, lunarMonth: number, lunarDay: number, isLeap: boolean = false): Date {
  let offset = 0;
  
  for (let y = 1900; y < lunarYear; y++) {
    offset += getLunarYearDays(y);
  }
  
  const leapMonth = getLeapMonth(lunarYear);
  let leap = false;
  
  for (let m = 1; m < lunarMonth; m++) {
    if (leapMonth > 0 && m === leapMonth && !leap) {
      leap = true;
      m--;
    }
    if (leap) {
      offset += getLeapDays(lunarYear);
    } else {
      offset += getLunarMonthDays(lunarYear, m);
    }
    if (leap && m === leapMonth) {
      leap = false;
    }
  }
  
  if (isLeap && leapMonth === lunarMonth) {
    offset += getLunarMonthDays(lunarYear, lunarMonth);
  }
  
  offset += lunarDay;
  
  const baseDate = new Date(1900, 0, 31);
  return new Date(baseDate.getTime() + offset * 86400000);
}

// 천간 지지 계산
const HEAVENLY_STEMS = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'];
const EARTHLY_BRANCHES = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'];
const ZODIAC_ANIMALS = ['쥐', '소', '호랑이', '토끼', '용', '뱀', '말', '양', '원숭이', '닭', '개', '돼지'];

function getGanZhi(year: number): { gan: string; zhi: string; zodiac: string } {
  const ganIndex = (year - 4) % 10;
  const zhiIndex = (year - 4) % 12;
  return {
    gan: HEAVENLY_STEMS[ganIndex],
    zhi: EARTHLY_BRANCHES[zhiIndex],
    zodiac: ZODIAC_ANIMALS[zhiIndex],
  };
}

type ConversionMode = 'solarToLunar' | 'lunarToSolar';

export default function LunarSolarConverter() {
  const [mode, setMode] = useState<ConversionMode>('solarToLunar');
  const [solarDate, setSolarDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [lunarYear, setLunarYear] = useState<number>(new Date().getFullYear());
  const [lunarMonth, setLunarMonth] = useState<number>(new Date().getMonth() + 1);
  const [lunarDay, setLunarDay] = useState<number>(new Date().getDate());
  const [isLeapMonth, setIsLeapMonth] = useState<boolean>(false);

  const [
    solarToLunarText,
    lunarToSolarText,
    selectSolarDateText,
    inputLunarDateText,
    yearText,
    monthText,
    dayText,
    lunarDateText,
    solarDateText,
    ganjiText,
    zodiacText,
    sexagenaryText,
    ordinalText,
    notesText,
    dateRangeNote,
    leapMonthNote,
    ganjiExplanation,
    leapText,
    calculateAsText,
    hasLeapMonthText,
  ] = useTranslatedTexts([
    '양력 → 음력',
    '음력 → 양력',
    '양력 날짜 선택',
    '음력 날짜 입력',
    '년',
    '월',
    '일',
    '음력 날짜',
    '양력 날짜',
    '간지',
    '띠',
    '60갑자',
    '번째',
    '참고사항',
    '1900년 ~ 2099년 사이의 날짜만 지원해요',
    '음력 윤달이 있는 해는 자동으로 표시돼요',
    '천간(갑을병정무기경신임계)과 지지(자축인묘진사오미신유술해)로 60갑자가 구성돼요',
    '윤',
    '월로 계산',
    '이 해에 윤달이 있어요',
  ]);

  const result = useMemo(() => {
    try {
      if (mode === 'solarToLunar') {
        const date = new Date(solarDate);
        if (isNaN(date.getTime())) return null;
        
        const lunar = solarToLunar(date);
        const ganZhi = getGanZhi(lunar.year);
        
        return {
          type: 'lunar' as const,
          year: lunar.year,
          month: lunar.month,
          day: lunar.day,
          isLeap: lunar.isLeap,
          ganZhi,
        };
      } else {
        const solarResult = lunarToSolar(lunarYear, lunarMonth, lunarDay, isLeapMonth);
        const ganZhi = getGanZhi(lunarYear);
        
        return {
          type: 'solar' as const,
          date: solarResult,
          ganZhi,
        };
      }
    } catch {
      return null;
    }
  }, [mode, solarDate, lunarYear, lunarMonth, lunarDay, isLeapMonth]);

  const leapMonth = getLeapMonth(lunarYear);

  return (
    <div className="space-y-6">
      {/* 모드 선택 */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => setMode('solarToLunar')}
          className={`py-4 px-4 rounded-xl font-medium transition-all ${
            mode === 'solarToLunar'
              ? 'bg-ai-primary text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          ☀️ {solarToLunarText}
        </button>
        <button
          onClick={() => setMode('lunarToSolar')}
          className={`py-4 px-4 rounded-xl font-medium transition-all ${
            mode === 'lunarToSolar'
              ? 'bg-ai-primary text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          🌙 {lunarToSolarText}
        </button>
      </div>

      {/* 양력 → 음력 입력 */}
      {mode === 'solarToLunar' && (
        <div className="bg-gray-50 rounded-2xl p-5">
          <label className="block font-semibold text-gray-700 mb-3">
            ☀️ {selectSolarDateText}
          </label>
          <input
            type="date"
            value={solarDate}
            onChange={(e) => setSolarDate(e.target.value)}
            min="1900-02-01"
            max="2099-12-31"
            className="w-full p-4 text-xl text-center border-2 border-gray-200 rounded-xl focus:border-ai-primary focus:outline-none"
          />
        </div>
      )}

      {/* 음력 → 양력 입력 */}
      {mode === 'lunarToSolar' && (
        <div className="bg-gray-50 rounded-2xl p-5 space-y-4">
          <label className="block font-semibold text-gray-700 mb-3">
            🌙 {inputLunarDateText}
          </label>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-sm text-gray-500 mb-1 block">{yearText}</label>
              <select
                value={lunarYear}
                onChange={(e) => setLunarYear(parseInt(e.target.value))}
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-ai-primary focus:outline-none"
              >
                {Array.from({ length: 200 }, (_, i) => 1900 + i).map((y) => (
                  <option key={y} value={y}>{y}{yearText}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-500 mb-1 block">{monthText}</label>
              <select
                value={lunarMonth}
                onChange={(e) => setLunarMonth(parseInt(e.target.value))}
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-ai-primary focus:outline-none"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <option key={m} value={m}>{m}{monthText}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-500 mb-1 block">{dayText}</label>
              <select
                value={lunarDay}
                onChange={(e) => setLunarDay(parseInt(e.target.value))}
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-ai-primary focus:outline-none"
              >
                {Array.from({ length: 30 }, (_, i) => i + 1).map((d) => (
                  <option key={d} value={d}>{d}{dayText}</option>
                ))}
              </select>
            </div>
          </div>
          
          {leapMonth > 0 && lunarMonth === leapMonth && (
            <label className="flex items-center gap-2 bg-yellow-50 p-3 rounded-xl">
              <input
                type="checkbox"
                checked={isLeapMonth}
                onChange={(e) => setIsLeapMonth(e.target.checked)}
                className="w-5 h-5 rounded"
              />
              <span className="text-yellow-800">
                {leapText}{leapMonth}{calculateAsText} ({hasLeapMonthText})
              </span>
            </label>
          )}
        </div>
      )}

      {/* 결과 */}
      {result && (
        <div className="bg-gradient-to-br from-ai-primary to-purple-600 rounded-2xl p-6 text-white">
          <div className="text-center">
            {result.type === 'lunar' ? (
              <>
                <p className="text-lg opacity-90 mb-2">🌙 {lunarDateText}</p>
                <p className="text-4xl font-bold">
                  {result.year}{yearText} {result.isLeap && leapText}{result.month}{monthText} {result.day}{dayText}
                </p>
              </>
            ) : (
              <>
                <p className="text-lg opacity-90 mb-2">☀️ {solarDateText}</p>
                <p className="text-4xl font-bold">
                  {result.date.getFullYear()}{yearText} {result.date.getMonth() + 1}{monthText} {result.date.getDate()}{dayText}
                </p>
              </>
            )}
          </div>
          
          {/* 간지 정보 */}
          <div className="mt-6 pt-4 border-t border-white/20 grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm opacity-80">{ganjiText}</p>
              <p className="text-xl font-bold">{result.ganZhi.gan}{result.ganZhi.zhi}{yearText}</p>
            </div>
            <div>
              <p className="text-sm opacity-80">{zodiacText}</p>
              <p className="text-xl font-bold">{result.ganZhi.zodiac}{zodiacText} 🐾</p>
            </div>
            <div>
              <p className="text-sm opacity-80">{sexagenaryText}</p>
              <p className="text-xl font-bold">
                {HEAVENLY_STEMS.indexOf(result.ganZhi.gan) * 6 + EARTHLY_BRANCHES.indexOf(result.ganZhi.zhi) % 6 + 1}{ordinalText}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 안내 */}
      <div className="bg-gray-50 rounded-xl p-4">
        <h3 className="font-bold text-gray-700 mb-2">💡 {notesText}</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• {dateRangeNote}</li>
          <li>• {leapMonthNote}</li>
          <li>• {ganjiExplanation}</li>
        </ul>
      </div>
    </div>
  );
}
