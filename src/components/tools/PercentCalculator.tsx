'use client';

import { useState, useMemo } from 'react';
import { useTranslatedTexts } from '@/lib/use-translations';

type CalculationMode = 'whatPercent' | 'percentOf' | 'increase' | 'change';

function formatNumber(num: number, decimals: number = 2): string {
  if (Number.isInteger(num)) return num.toLocaleString('ko-KR');
  return num.toLocaleString('ko-KR', { minimumFractionDigits: 0, maximumFractionDigits: decimals });
}

export default function PercentCalculator() {
  const koreanTexts = [
    // Mode labels and descriptions
    'A는 B의 몇 %?',         // 0
    '비율 구하기',            // 1
    'A의 B%는?',             // 2
    '퍼센트 값 계산',         // 3
    'A에서 B% 증감',         // 4
    '증가/감소 계산',         // 5
    'A→B 변화율',            // 6
    '변동률 계산',            // 7
    // Input labels
    '값 A',                  // 8
    '기준값 B',              // 9
    '부분값',                // 10
    '전체값',                // 11
    '기준값 A',              // 12
    '퍼센트 B',              // 13
    '기준값',                // 14
    '증감률 B',              // 15
    '이전 값 A',             // 16
    '이후 값 B',             // 17
    '이전',                  // 18
    '이후',                  // 19
    // Example descriptions
    '1000의 10%',            // 20
    '5만의 3.5%',            // 21
    '20만의 15%',            // 22
    '만원 +10%',             // 23
    '5만원 +20%',            // 24
    // Quick examples label
    '빠른 예시:',            // 25
    // Result labels
    '은',                    // 26
    '의',                    // 27
    '에서',                  // 28
    '% 변화',                // 29
    '증가',                  // 30
    '감소',                  // 31
    '차이:',                 // 32
    // Formula section
    '계산식',                // 33
    '증가:',                 // 34
    '감소:',                 // 35
    // Usage examples section
    '활용 예시',             // 36
    '할인 계산',             // 37
    '50,000원 상품 30% 할인 → "A의 B%" 사용', // 38
    '성적 비율',             // 39
    '90점/100점 = 몇 %? → "A는 B의 몇 %" 사용', // 40
    '투자 수익률',           // 41
    '100만원→130만원 = 몇 % 수익? → "변화율" 사용', // 42
    '인상/인하',             // 43
    '월급 300만원 5% 인상 → "증감" 사용', // 44
    // Empty state
    '값을 입력하면',         // 45
    '퍼센트가 자동으로 계산됩니다.', // 46
  ];

  const translations = useTranslatedTexts(koreanTexts);

  const t = {
    whatPercentLabel: translations[0],
    whatPercentDesc: translations[1],
    percentOfLabel: translations[2],
    percentOfDesc: translations[3],
    increaseLabel: translations[4],
    increaseDesc: translations[5],
    changeLabel: translations[6],
    changeDesc: translations[7],
    valueA: translations[8],
    baseValueB: translations[9],
    partValue: translations[10],
    totalValue: translations[11],
    baseValueA: translations[12],
    percentB: translations[13],
    baseValue: translations[14],
    changeRateB: translations[15],
    prevValueA: translations[16],
    nextValueB: translations[17],
    prev: translations[18],
    next: translations[19],
    example1000_10: translations[20],
    example50k_3_5: translations[21],
    example200k_15: translations[22],
    example10k_10: translations[23],
    example50k_20: translations[24],
    quickExamples: translations[25],
    is: translations[26],
    of: translations[27],
    from: translations[28],
    percentChange: translations[29],
    increase: translations[30],
    decrease: translations[31],
    difference: translations[32],
    formula: translations[33],
    increaseFormula: translations[34],
    decreaseFormula: translations[35],
    usageExamples: translations[36],
    discountCalc: translations[37],
    discountDesc: translations[38],
    gradeRatio: translations[39],
    gradeDesc: translations[40],
    investReturn: translations[41],
    investDesc: translations[42],
    raiseReduction: translations[43],
    raiseDesc: translations[44],
    enterValues: translations[45],
    autoCalculate: translations[46],
  };

  const [mode, setMode] = useState<CalculationMode>('whatPercent');
  
  const [value1, setValue1] = useState<string>('');
  const [value2, setValue2] = useState<string>('');

  const handleInputChange = (setter: (val: string) => void) => (value: string) => {
    const numericValue = value.replace(/[^0-9.-]/g, '');
    setter(numericValue);
  };

  const resetInputs = () => {
    setValue1('');
    setValue2('');
  };

  const result = useMemo(() => {
    const num1 = parseFloat(value1) || 0;
    const num2 = parseFloat(value2) || 0;

    if (mode === 'whatPercent') {
      if (num2 === 0) return null;
      return { value: (num1 / num2) * 100, unit: '%' };
    } else if (mode === 'percentOf') {
      return { value: num1 * (num2 / 100), unit: '' };
    } else if (mode === 'increase') {
      const increased = num1 * (1 + num2 / 100);
      const decreased = num1 * (1 - num2 / 100);
      return { 
        value: increased, 
        decreased,
        difference: num1 * (num2 / 100),
        unit: '' 
      };
    } else {
      if (num1 === 0) return null;
      const changeRate = ((num2 - num1) / num1) * 100;
      return { value: changeRate, difference: num2 - num1, unit: '%' };
    }
  }, [mode, value1, value2]);

  const modes = [
    { key: 'whatPercent' as const, label: t.whatPercentLabel, icon: '🔢', desc: t.whatPercentDesc },
    { key: 'percentOf' as const, label: t.percentOfLabel, icon: '📊', desc: t.percentOfDesc },
    { key: 'increase' as const, label: t.increaseLabel, icon: '📈', desc: t.increaseDesc },
    { key: 'change' as const, label: t.changeLabel, icon: '🔄', desc: t.changeDesc },
  ];

  const getInputLabels = () => {
    switch (mode) {
      case 'whatPercent':
        return { label1: t.valueA, label2: t.baseValueB, placeholder1: t.partValue, placeholder2: t.totalValue };
      case 'percentOf':
        return { label1: t.baseValueA, label2: t.percentB, placeholder1: t.baseValue, placeholder2: '%' };
      case 'increase':
        return { label1: t.baseValueA, label2: t.changeRateB, placeholder1: t.baseValue, placeholder2: '%' };
      case 'change':
        return { label1: t.prevValueA, label2: t.nextValueB, placeholder1: t.prev, placeholder2: t.next };
    }
  };

  const labels = getInputLabels();

  const examples: Record<CalculationMode, { v1: string; v2: string; desc: string }[]> = {
    whatPercent: [
      { v1: '30', v2: '100', desc: '30/100' },
      { v1: '75', v2: '300', desc: '75/300' },
      { v1: '450', v2: '600', desc: '450/600' },
    ],
    percentOf: [
      { v1: '1000', v2: '10', desc: t.example1000_10 },
      { v1: '50000', v2: '3.5', desc: t.example50k_3_5 },
      { v1: '200000', v2: '15', desc: t.example200k_15 },
    ],
    increase: [
      { v1: '10000', v2: '10', desc: t.example10k_10 },
      { v1: '50000', v2: '20', desc: t.example50k_20 },
      { v1: '100', v2: '50', desc: '100 +50%' },
    ],
    change: [
      { v1: '100', v2: '120', desc: '100→120' },
      { v1: '500', v2: '450', desc: '500→450' },
      { v1: '1000', v2: '1500', desc: '1000→1500' },
    ],
  };

  return (
    <div className="space-y-6">
      {/* 모드 선택 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {modes.map((m) => (
          <button
            key={m.key}
            onClick={() => {
              setMode(m.key);
              resetInputs();
            }}
            className={`p-3 rounded-xl border-2 transition-all text-center ${
              mode === m.key
                ? 'border-ai-primary bg-ai-primary/10'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <span className="text-2xl block mb-1">{m.icon}</span>
            <span className="font-medium text-gray-700 text-sm block">{m.label}</span>
            <span className="text-xs text-gray-500">{m.desc}</span>
          </button>
        ))}
      </div>

      {/* 입력 섹션 */}
      <div className="bg-gray-50 rounded-2xl p-5 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">{labels.label1}</label>
            <input
              type="text"
              value={value1}
              onChange={(e) => handleInputChange(setValue1)(e.target.value)}
              className="w-full p-4 text-xl font-bold text-center border-2 border-gray-200 rounded-xl focus:border-ai-primary focus:outline-none"
              placeholder={labels.placeholder1}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">{labels.label2}</label>
            <div className="relative">
              <input
                type="text"
                value={value2}
                onChange={(e) => handleInputChange(setValue2)(e.target.value)}
                className="w-full p-4 text-xl font-bold text-center border-2 border-gray-200 rounded-xl focus:border-ai-primary focus:outline-none"
                placeholder={labels.placeholder2}
              />
              {(mode === 'percentOf' || mode === 'increase') && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
              )}
            </div>
          </div>
        </div>

        {/* 예시 버튼 */}
        <div>
          <p className="text-sm text-gray-500 mb-2">{t.quickExamples}</p>
          <div className="flex gap-2 flex-wrap">
            {examples[mode].map((ex, i) => (
              <button
                key={i}
                onClick={() => {
                  setValue1(ex.v1);
                  setValue2(ex.v2);
                }}
                className="py-1 px-3 bg-white border border-gray-200 rounded-lg text-sm hover:border-ai-primary transition-all"
              >
                {ex.desc}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 결과 */}
      {result && (value1 || value2) && (
        <div className="bg-gradient-to-br from-ai-primary to-purple-600 rounded-2xl p-6 text-white">
          <div className="text-center">
            {mode === 'whatPercent' && (
              <>
                <p className="text-lg opacity-90 mb-2">
                  {formatNumber(parseFloat(value1) || 0)}{t.is} {formatNumber(parseFloat(value2) || 0)}{t.of}
                </p>
                <p className="text-5xl font-bold">
                  {formatNumber(result.value)}{result.unit}
                </p>
              </>
            )}
            
            {mode === 'percentOf' && (
              <>
                <p className="text-lg opacity-90 mb-2">
                  {formatNumber(parseFloat(value1) || 0)}{t.of} {formatNumber(parseFloat(value2) || 0)}%{t.is}
                </p>
                <p className="text-5xl font-bold">
                  {formatNumber(result.value)}
                </p>
              </>
            )}

            {mode === 'increase' && (
              <>
                <p className="text-lg opacity-90 mb-2">
                  {formatNumber(parseFloat(value1) || 0)}{t.from} {formatNumber(parseFloat(value2) || 0)}{t.percentChange}
                </p>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="bg-white/20 rounded-xl p-4">
                    <p className="text-sm opacity-80">{t.increase} (+{value2}%)</p>
                    <p className="text-3xl font-bold">{formatNumber(result.value)}</p>
                    <p className="text-sm opacity-70">+{formatNumber(result.difference || 0)}</p>
                  </div>
                  <div className="bg-white/20 rounded-xl p-4">
                    <p className="text-sm opacity-80">{t.decrease} (-{value2}%)</p>
                    <p className="text-3xl font-bold">{formatNumber(result.decreased || 0)}</p>
                    <p className="text-sm opacity-70">-{formatNumber(result.difference || 0)}</p>
                  </div>
                </div>
              </>
            )}

            {mode === 'change' && (
              <>
                <p className="text-lg opacity-90 mb-2">
                  {formatNumber(parseFloat(value1) || 0)} → {formatNumber(parseFloat(value2) || 0)}
                </p>
                <p className={`text-5xl font-bold ${result.value >= 0 ? '' : 'text-red-200'}`}>
                  {result.value >= 0 ? '+' : ''}{formatNumber(result.value)}{result.unit}
                </p>
                <p className="text-lg mt-2 opacity-80">
                  {t.difference} {result.difference && result.difference >= 0 ? '+' : ''}{formatNumber(result.difference || 0)}
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {/* 계산식 설명 */}
      {result && (value1 || value2) && (
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="font-semibold text-gray-700 mb-2">📐 {t.formula}</p>
          <div className="text-sm text-gray-600 font-mono bg-white rounded-lg p-3">
            {mode === 'whatPercent' && (
              <p>({value1} ÷ {value2}) × 100 = {formatNumber(result.value)}%</p>
            )}
            {mode === 'percentOf' && (
              <p>{value1} × ({value2} ÷ 100) = {formatNumber(result.value)}</p>
            )}
            {mode === 'increase' && (
              <>
                <p>{t.increaseFormula} {value1} × (1 + {value2}/100) = {formatNumber(result.value)}</p>
                <p>{t.decreaseFormula} {value1} × (1 - {value2}/100) = {formatNumber(result.decreased || 0)}</p>
              </>
            )}
            {mode === 'change' && (
              <p>(({value2} - {value1}) ÷ {value1}) × 100 = {formatNumber(result.value)}%</p>
            )}
          </div>
        </div>
      )}

      {/* 실생활 활용 예시 */}
      <div className="bg-blue-50 rounded-xl p-4">
        <h3 className="font-bold text-blue-800 mb-3">💡 {t.usageExamples}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-blue-700">
          <div className="bg-white rounded-lg p-3">
            <p className="font-medium mb-1">🛒 {t.discountCalc}</p>
            <p className="text-blue-600">{t.discountDesc}</p>
          </div>
          <div className="bg-white rounded-lg p-3">
            <p className="font-medium mb-1">📈 {t.gradeRatio}</p>
            <p className="text-blue-600">{t.gradeDesc}</p>
          </div>
          <div className="bg-white rounded-lg p-3">
            <p className="font-medium mb-1">💰 {t.investReturn}</p>
            <p className="text-blue-600">{t.investDesc}</p>
          </div>
          <div className="bg-white rounded-lg p-3">
            <p className="font-medium mb-1">📊 {t.raiseReduction}</p>
            <p className="text-blue-600">{t.raiseDesc}</p>
          </div>
        </div>
      </div>

      {/* 빈 상태 */}
      {(!value1 && !value2) && (
        <div className="bg-gray-50 rounded-2xl p-8 text-center">
          <p className="text-4xl mb-4">📊</p>
          <p className="text-gray-500">{t.enterValues}<br/>{t.autoCalculate}</p>
        </div>
      )}
    </div>
  );
}
