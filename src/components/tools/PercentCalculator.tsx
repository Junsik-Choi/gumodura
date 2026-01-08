'use client';

import { useState, useMemo } from 'react';

type CalculationMode = 'whatPercent' | 'percentOf' | 'increase' | 'change';

function formatNumber(num: number, decimals: number = 2): string {
  if (Number.isInteger(num)) return num.toLocaleString('ko-KR');
  return num.toLocaleString('ko-KR', { minimumFractionDigits: 0, maximumFractionDigits: decimals });
}

export default function PercentCalculator() {
  const [mode, setMode] = useState<CalculationMode>('whatPercent');
  
  // 각 모드별 입력값
  const [value1, setValue1] = useState<string>('');
  const [value2, setValue2] = useState<string>('');

  const handleInputChange = (setter: (val: string) => void) => (value: string) => {
    // 숫자와 소수점만 허용
    const numericValue = value.replace(/[^0-9.-]/g, '');
    setter(numericValue);
  };

  const resetInputs = () => {
    setValue1('');
    setValue2('');
  };

  // 결과 계산
  const result = useMemo(() => {
    const num1 = parseFloat(value1) || 0;
    const num2 = parseFloat(value2) || 0;

    if (mode === 'whatPercent') {
      // A는 B의 몇 %인가?
      if (num2 === 0) return null;
      return { value: (num1 / num2) * 100, unit: '%' };
    } else if (mode === 'percentOf') {
      // A의 B%는?
      return { value: num1 * (num2 / 100), unit: '' };
    } else if (mode === 'increase') {
      // A에서 B% 증가/감소하면?
      const increased = num1 * (1 + num2 / 100);
      const decreased = num1 * (1 - num2 / 100);
      return { 
        value: increased, 
        decreased,
        difference: num1 * (num2 / 100),
        unit: '' 
      };
    } else {
      // A에서 B로 변화율은?
      if (num1 === 0) return null;
      const changeRate = ((num2 - num1) / num1) * 100;
      return { value: changeRate, difference: num2 - num1, unit: '%' };
    }
  }, [mode, value1, value2]);

  const modes = [
    { key: 'whatPercent' as const, label: 'A는 B의 몇 %?', icon: '🔢', desc: '비율 구하기' },
    { key: 'percentOf' as const, label: 'A의 B%는?', icon: '📊', desc: '퍼센트 값 계산' },
    { key: 'increase' as const, label: 'A에서 B% 증감', icon: '📈', desc: '증가/감소 계산' },
    { key: 'change' as const, label: 'A→B 변화율', icon: '🔄', desc: '변동률 계산' },
  ];

  const getInputLabels = () => {
    switch (mode) {
      case 'whatPercent':
        return { label1: '값 A', label2: '기준값 B', placeholder1: '부분값', placeholder2: '전체값' };
      case 'percentOf':
        return { label1: '기준값 A', label2: '퍼센트 B', placeholder1: '기준값', placeholder2: '%' };
      case 'increase':
        return { label1: '기준값 A', label2: '증감률 B', placeholder1: '기준값', placeholder2: '%' };
      case 'change':
        return { label1: '이전 값 A', label2: '이후 값 B', placeholder1: '이전', placeholder2: '이후' };
    }
  };

  const labels = getInputLabels();

  // 예시 버튼
  const examples: Record<CalculationMode, { v1: string; v2: string; desc: string }[]> = {
    whatPercent: [
      { v1: '30', v2: '100', desc: '30/100' },
      { v1: '75', v2: '300', desc: '75/300' },
      { v1: '450', v2: '600', desc: '450/600' },
    ],
    percentOf: [
      { v1: '1000', v2: '10', desc: '1000의 10%' },
      { v1: '50000', v2: '3.5', desc: '5만의 3.5%' },
      { v1: '200000', v2: '15', desc: '20만의 15%' },
    ],
    increase: [
      { v1: '10000', v2: '10', desc: '만원 +10%' },
      { v1: '50000', v2: '20', desc: '5만원 +20%' },
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
          <p className="text-sm text-gray-500 mb-2">빠른 예시:</p>
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
                  {formatNumber(parseFloat(value1) || 0)}은 {formatNumber(parseFloat(value2) || 0)}의
                </p>
                <p className="text-5xl font-bold">
                  {formatNumber(result.value)}{result.unit}
                </p>
              </>
            )}
            
            {mode === 'percentOf' && (
              <>
                <p className="text-lg opacity-90 mb-2">
                  {formatNumber(parseFloat(value1) || 0)}의 {formatNumber(parseFloat(value2) || 0)}%는
                </p>
                <p className="text-5xl font-bold">
                  {formatNumber(result.value)}
                </p>
              </>
            )}

            {mode === 'increase' && (
              <>
                <p className="text-lg opacity-90 mb-2">
                  {formatNumber(parseFloat(value1) || 0)}에서 {formatNumber(parseFloat(value2) || 0)}% 변화
                </p>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="bg-white/20 rounded-xl p-4">
                    <p className="text-sm opacity-80">증가 (+{value2}%)</p>
                    <p className="text-3xl font-bold">{formatNumber(result.value)}</p>
                    <p className="text-sm opacity-70">+{formatNumber(result.difference || 0)}</p>
                  </div>
                  <div className="bg-white/20 rounded-xl p-4">
                    <p className="text-sm opacity-80">감소 (-{value2}%)</p>
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
                  차이: {result.difference && result.difference >= 0 ? '+' : ''}{formatNumber(result.difference || 0)}
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {/* 계산식 설명 */}
      {result && (value1 || value2) && (
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="font-semibold text-gray-700 mb-2">📐 계산식</p>
          <div className="text-sm text-gray-600 font-mono bg-white rounded-lg p-3">
            {mode === 'whatPercent' && (
              <p>({value1} ÷ {value2}) × 100 = {formatNumber(result.value)}%</p>
            )}
            {mode === 'percentOf' && (
              <p>{value1} × ({value2} ÷ 100) = {formatNumber(result.value)}</p>
            )}
            {mode === 'increase' && (
              <>
                <p>증가: {value1} × (1 + {value2}/100) = {formatNumber(result.value)}</p>
                <p>감소: {value1} × (1 - {value2}/100) = {formatNumber(result.decreased || 0)}</p>
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
        <h3 className="font-bold text-blue-800 mb-3">💡 활용 예시</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-blue-700">
          <div className="bg-white rounded-lg p-3">
            <p className="font-medium mb-1">🛒 할인 계산</p>
            <p className="text-blue-600">50,000원 상품 30% 할인 → &quot;A의 B%&quot; 사용</p>
          </div>
          <div className="bg-white rounded-lg p-3">
            <p className="font-medium mb-1">📈 성적 비율</p>
            <p className="text-blue-600">90점/100점 = 몇 %? → &quot;A는 B의 몇 %&quot; 사용</p>
          </div>
          <div className="bg-white rounded-lg p-3">
            <p className="font-medium mb-1">💰 투자 수익률</p>
            <p className="text-blue-600">100만원→130만원 = 몇 % 수익? → &quot;변화율&quot; 사용</p>
          </div>
          <div className="bg-white rounded-lg p-3">
            <p className="font-medium mb-1">📊 인상/인하</p>
            <p className="text-blue-600">월급 300만원 5% 인상 → &quot;증감&quot; 사용</p>
          </div>
        </div>
      </div>

      {/* 빈 상태 */}
      {(!value1 && !value2) && (
        <div className="bg-gray-50 rounded-2xl p-8 text-center">
          <p className="text-4xl mb-4">📊</p>
          <p className="text-gray-500">값을 입력하면<br/>퍼센트가 자동으로 계산됩니다.</p>
        </div>
      )}
    </div>
  );
}
