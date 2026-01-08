'use client';

import { useState, useCallback, useMemo } from 'react';
import { useTranslatedTexts } from '@/lib/use-translations';

type UnitCategory = 'length' | 'weight' | 'temperature' | 'area' | 'volume' | 'speed';

interface UnitInfo {
  name: string;
  symbol: string;
  toBase: (value: number) => number;
  fromBase: (value: number) => number;
}

// Korean texts for translation
const KOREAN_TEXTS = [
  // Category names (0-5)
  '길이', '무게', '온도', '면적', '부피', '속도',
  // Length units (6-13)
  '밀리미터', '센티미터', '미터', '킬로미터', '인치', '피트', '야드', '마일',
  // Weight units (14-20)
  '밀리그램', '그램', '킬로그램', '톤', '온스', '파운드', '근',
  // Temperature units (21-23)
  '섭씨', '화씨', '켈빈',
  // Area units (24-29)
  '제곱미터', '제곱킬로미터', '헥타르', '평', '에이커', '제곱피트',
  // Volume units (30-35)
  '밀리리터', '리터', '세제곱센티미터', '세제곱미터', '갤런 (US)', '컵',
  // Speed units (36-39)
  '미터/초', '킬로미터/시', '마일/시', '노트',
  // Labels (40-42)
  '변환할 값', '변환 결과', '빠른 참조',
];

export default function UnitConverter() {
  const translated = useTranslatedTexts(KOREAN_TEXTS);

  const CATEGORIES: { key: UnitCategory; name: string; icon: string }[] = useMemo(() => [
    { key: 'length', name: translated[0], icon: '📏' },
    { key: 'weight', name: translated[1], icon: '⚖️' },
    { key: 'temperature', name: translated[2], icon: '🌡️' },
    { key: 'area', name: translated[3], icon: '📐' },
    { key: 'volume', name: translated[4], icon: '🧊' },
    { key: 'speed', name: translated[5], icon: '🏃' },
  ], [translated]);

  const UNITS: Record<UnitCategory, UnitInfo[]> = useMemo(() => ({
    length: [
      { name: translated[6], symbol: 'mm', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      { name: translated[7], symbol: 'cm', toBase: (v) => v / 100, fromBase: (v) => v * 100 },
      { name: translated[8], symbol: 'm', toBase: (v) => v, fromBase: (v) => v },
      { name: translated[9], symbol: 'km', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
      { name: translated[10], symbol: 'in', toBase: (v) => v * 0.0254, fromBase: (v) => v / 0.0254 },
      { name: translated[11], symbol: 'ft', toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 },
      { name: translated[12], symbol: 'yd', toBase: (v) => v * 0.9144, fromBase: (v) => v / 0.9144 },
      { name: translated[13], symbol: 'mi', toBase: (v) => v * 1609.344, fromBase: (v) => v / 1609.344 },
    ],
    weight: [
      { name: translated[14], symbol: 'mg', toBase: (v) => v / 1000000, fromBase: (v) => v * 1000000 },
      { name: translated[15], symbol: 'g', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      { name: translated[16], symbol: 'kg', toBase: (v) => v, fromBase: (v) => v },
      { name: translated[17], symbol: 't', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
      { name: translated[18], symbol: 'oz', toBase: (v) => v * 0.0283495, fromBase: (v) => v / 0.0283495 },
      { name: translated[19], symbol: 'lb', toBase: (v) => v * 0.453592, fromBase: (v) => v / 0.453592 },
      { name: translated[20], symbol: '근', toBase: (v) => v * 0.6, fromBase: (v) => v / 0.6 },
    ],
    temperature: [
      { name: translated[21], symbol: '°C', toBase: (v) => v, fromBase: (v) => v },
      { name: translated[22], symbol: '°F', toBase: (v) => (v - 32) * 5 / 9, fromBase: (v) => v * 9 / 5 + 32 },
      { name: translated[23], symbol: 'K', toBase: (v) => v - 273.15, fromBase: (v) => v + 273.15 },
    ],
    area: [
      { name: translated[24], symbol: 'm²', toBase: (v) => v, fromBase: (v) => v },
      { name: translated[25], symbol: 'km²', toBase: (v) => v * 1000000, fromBase: (v) => v / 1000000 },
      { name: translated[26], symbol: 'ha', toBase: (v) => v * 10000, fromBase: (v) => v / 10000 },
      { name: translated[27], symbol: '평', toBase: (v) => v * 3.3058, fromBase: (v) => v / 3.3058 },
      { name: translated[28], symbol: 'ac', toBase: (v) => v * 4046.86, fromBase: (v) => v / 4046.86 },
      { name: translated[29], symbol: 'ft²', toBase: (v) => v * 0.092903, fromBase: (v) => v / 0.092903 },
    ],
    volume: [
      { name: translated[30], symbol: 'ml', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      { name: translated[31], symbol: 'L', toBase: (v) => v, fromBase: (v) => v },
      { name: translated[32], symbol: 'cm³', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      { name: translated[33], symbol: 'm³', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
      { name: translated[34], symbol: 'gal', toBase: (v) => v * 3.78541, fromBase: (v) => v / 3.78541 },
      { name: translated[35], symbol: 'cup', toBase: (v) => v * 0.24, fromBase: (v) => v / 0.24 },
    ],
    speed: [
      { name: translated[36], symbol: 'm/s', toBase: (v) => v, fromBase: (v) => v },
      { name: translated[37], symbol: 'km/h', toBase: (v) => v / 3.6, fromBase: (v) => v * 3.6 },
      { name: translated[38], symbol: 'mph', toBase: (v) => v * 0.44704, fromBase: (v) => v / 0.44704 },
      { name: translated[39], symbol: 'kn', toBase: (v) => v * 0.514444, fromBase: (v) => v / 0.514444 },
    ],
  }), [translated]);

  const [category, setCategory] = useState<UnitCategory>('length');
  const [fromUnit, setFromUnit] = useState(0);
  const [toUnit, setToUnit] = useState(1);
  const [value, setValue] = useState<string>('1');

  const units = UNITS[category];
  const from = units[fromUnit];
  const to = units[toUnit];

  const convert = useCallback((val: string): string => {
    const num = parseFloat(val);
    if (isNaN(num)) return '';
    const baseValue = from.toBase(num);
    const result = to.fromBase(baseValue);
    // 소수점 처리
    if (Math.abs(result) < 0.000001) return result.toExponential(4);
    if (Math.abs(result) >= 1000000) return result.toExponential(4);
    return parseFloat(result.toPrecision(10)).toString();
  }, [from, to]);

  const swapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  const result = convert(value);

  return (
    <div className="space-y-6">
      {/* 카테고리 선택 */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            onClick={() => {
              setCategory(cat.key);
              setFromUnit(0);
              setToUnit(1);
            }}
            className={`p-3 rounded-xl border-2 transition-all ${
              category === cat.key
                ? 'border-ai-primary bg-ai-primary/10'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <span className="text-2xl block mb-1">{cat.icon}</span>
            <span className="font-medium text-gray-700 text-sm">{cat.name}</span>
          </button>
        ))}
      </div>

      {/* 변환기 */}
      <div className="bg-gray-50 rounded-2xl p-6 space-y-6">
        {/* From */}
        <div>
          <label className="text-sm text-gray-500 mb-2 block">{translated[40]}</label>
          <div className="flex gap-3">
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="flex-1 p-4 text-2xl font-bold text-center border-2 border-gray-200 rounded-xl focus:border-ai-primary focus:outline-none"
              placeholder="0"
            />
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(Number(e.target.value))}
              className="p-4 text-lg border-2 border-gray-200 rounded-xl bg-white focus:border-ai-primary focus:outline-none min-w-[120px]"
            >
              {units.map((unit, i) => (
                <option key={i} value={i}>
                  {unit.symbol}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center">
          <button
            onClick={swapUnits}
            className="p-3 bg-white hover:bg-gray-100 border-2 border-gray-200 rounded-full transition-all hover:scale-110"
          >
            <span className="text-xl">⇅</span>
          </button>
        </div>

        {/* To */}
        <div>
          <label className="text-sm text-gray-500 mb-2 block">{translated[41]}</label>
          <div className="flex gap-3">
            <div className="flex-1 p-4 text-2xl font-bold text-center bg-white border-2 border-gray-200 rounded-xl">
              {result || '0'}
            </div>
            <select
              value={toUnit}
              onChange={(e) => setToUnit(Number(e.target.value))}
              className="p-4 text-lg border-2 border-gray-200 rounded-xl bg-white focus:border-ai-primary focus:outline-none min-w-[120px]"
            >
              {units.map((unit, i) => (
                <option key={i} value={i}>
                  {unit.symbol}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 결과 문장 */}
        <div className="text-center py-4 bg-white rounded-xl border-2 border-ai-primary/30">
          <p className="text-lg text-gray-700">
            <span className="font-bold text-ai-primary">{value || 0} {from.symbol}</span>
            <span className="mx-2">=</span>
            <span className="font-bold text-ai-primary">{result || 0} {to.symbol}</span>
          </p>
        </div>
      </div>

      {/* 빠른 참조 */}
      <div className="bg-gray-50 rounded-xl p-4">
        <p className="font-semibold text-gray-700 mb-3">📋 {translated[42]}</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {units.slice(0, 6).map((unit, i) => {
            if (i === fromUnit) return null;
            const baseValue = from.toBase(parseFloat(value) || 1);
            const converted = unit.fromBase(baseValue);
            const displayValue = Math.abs(converted) < 0.001 || Math.abs(converted) >= 100000 
              ? converted.toExponential(2) 
              : converted.toFixed(4).replace(/\.?0+$/, '');
            return (
              <button
                key={i}
                onClick={() => setToUnit(i)}
                className={`p-3 rounded-lg text-left transition-all ${
                  i === toUnit
                    ? 'bg-ai-primary/20 border-2 border-ai-primary'
                    : 'bg-white border-2 border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="text-sm text-gray-600">{unit.name}</span>
                <p className="font-bold text-gray-800">
                  {displayValue} <span className="text-gray-500">{unit.symbol}</span>
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
