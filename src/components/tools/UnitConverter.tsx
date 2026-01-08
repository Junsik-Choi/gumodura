'use client';

import { useState, useCallback } from 'react';

type UnitCategory = 'length' | 'weight' | 'temperature' | 'area' | 'volume' | 'speed';

interface UnitInfo {
  name: string;
  symbol: string;
  toBase: (value: number) => number;
  fromBase: (value: number) => number;
}

const CATEGORIES: { key: UnitCategory; name: string; icon: string }[] = [
  { key: 'length', name: '길이', icon: '📏' },
  { key: 'weight', name: '무게', icon: '⚖️' },
  { key: 'temperature', name: '온도', icon: '🌡️' },
  { key: 'area', name: '면적', icon: '📐' },
  { key: 'volume', name: '부피', icon: '🧊' },
  { key: 'speed', name: '속도', icon: '🏃' },
];

const UNITS: Record<UnitCategory, UnitInfo[]> = {
  length: [
    { name: '밀리미터', symbol: 'mm', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    { name: '센티미터', symbol: 'cm', toBase: (v) => v / 100, fromBase: (v) => v * 100 },
    { name: '미터', symbol: 'm', toBase: (v) => v, fromBase: (v) => v },
    { name: '킬로미터', symbol: 'km', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    { name: '인치', symbol: 'in', toBase: (v) => v * 0.0254, fromBase: (v) => v / 0.0254 },
    { name: '피트', symbol: 'ft', toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 },
    { name: '야드', symbol: 'yd', toBase: (v) => v * 0.9144, fromBase: (v) => v / 0.9144 },
    { name: '마일', symbol: 'mi', toBase: (v) => v * 1609.344, fromBase: (v) => v / 1609.344 },
  ],
  weight: [
    { name: '밀리그램', symbol: 'mg', toBase: (v) => v / 1000000, fromBase: (v) => v * 1000000 },
    { name: '그램', symbol: 'g', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    { name: '킬로그램', symbol: 'kg', toBase: (v) => v, fromBase: (v) => v },
    { name: '톤', symbol: 't', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    { name: '온스', symbol: 'oz', toBase: (v) => v * 0.0283495, fromBase: (v) => v / 0.0283495 },
    { name: '파운드', symbol: 'lb', toBase: (v) => v * 0.453592, fromBase: (v) => v / 0.453592 },
    { name: '근', symbol: '근', toBase: (v) => v * 0.6, fromBase: (v) => v / 0.6 },
  ],
  temperature: [
    { name: '섭씨', symbol: '°C', toBase: (v) => v, fromBase: (v) => v },
    { name: '화씨', symbol: '°F', toBase: (v) => (v - 32) * 5 / 9, fromBase: (v) => v * 9 / 5 + 32 },
    { name: '켈빈', symbol: 'K', toBase: (v) => v - 273.15, fromBase: (v) => v + 273.15 },
  ],
  area: [
    { name: '제곱미터', symbol: 'm²', toBase: (v) => v, fromBase: (v) => v },
    { name: '제곱킬로미터', symbol: 'km²', toBase: (v) => v * 1000000, fromBase: (v) => v / 1000000 },
    { name: '헥타르', symbol: 'ha', toBase: (v) => v * 10000, fromBase: (v) => v / 10000 },
    { name: '평', symbol: '평', toBase: (v) => v * 3.3058, fromBase: (v) => v / 3.3058 },
    { name: '에이커', symbol: 'ac', toBase: (v) => v * 4046.86, fromBase: (v) => v / 4046.86 },
    { name: '제곱피트', symbol: 'ft²', toBase: (v) => v * 0.092903, fromBase: (v) => v / 0.092903 },
  ],
  volume: [
    { name: '밀리리터', symbol: 'ml', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    { name: '리터', symbol: 'L', toBase: (v) => v, fromBase: (v) => v },
    { name: '제곱센티미터', symbol: 'cm³', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    { name: '제곱미터', symbol: 'm³', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    { name: '갤런 (US)', symbol: 'gal', toBase: (v) => v * 3.78541, fromBase: (v) => v / 3.78541 },
    { name: '컵', symbol: 'cup', toBase: (v) => v * 0.24, fromBase: (v) => v / 0.24 },
  ],
  speed: [
    { name: '미터/초', symbol: 'm/s', toBase: (v) => v, fromBase: (v) => v },
    { name: '킬로미터/시', symbol: 'km/h', toBase: (v) => v / 3.6, fromBase: (v) => v * 3.6 },
    { name: '마일/시', symbol: 'mph', toBase: (v) => v * 0.44704, fromBase: (v) => v / 0.44704 },
    { name: '노트', symbol: 'kn', toBase: (v) => v * 0.514444, fromBase: (v) => v / 0.514444 },
  ],
};

export default function UnitConverter() {
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
          <label className="text-sm text-gray-500 mb-2 block">변환할 값</label>
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
          <label className="text-sm text-gray-500 mb-2 block">변환 결과</label>
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
        <p className="font-semibold text-gray-700 mb-3">📋 빠른 참조</p>
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
