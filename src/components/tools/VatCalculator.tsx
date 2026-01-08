'use client';

import { useState, useMemo } from 'react';

type CalculationMode = 'fromTotal' | 'fromSupply' | 'fromTax';

function formatMoney(amount: number): string {
  return Math.round(amount).toLocaleString('ko-KR');
}

export default function VatCalculator() {
  const [mode, setMode] = useState<CalculationMode>('fromTotal');
  const [inputValue, setInputValue] = useState<string>('');
  const [taxRate, setTaxRate] = useState<number>(10);

  const handleInputChange = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    setInputValue(numericValue);
  };

  const calculation = useMemo(() => {
    const input = parseFloat(inputValue) || 0;
    const rate = taxRate / 100;
    
    let supplyAmount = 0;
    let taxAmount = 0;
    let totalAmount = 0;

    if (mode === 'fromTotal') {
      // 합계금액에서 역산
      totalAmount = input;
      supplyAmount = Math.round(input / (1 + rate));
      taxAmount = totalAmount - supplyAmount;
    } else if (mode === 'fromSupply') {
      // 공급가액에서 계산
      supplyAmount = input;
      taxAmount = Math.round(input * rate);
      totalAmount = supplyAmount + taxAmount;
    } else {
      // 세액에서 역산
      taxAmount = input;
      supplyAmount = Math.round(input / rate);
      totalAmount = supplyAmount + taxAmount;
    }

    return { supplyAmount, taxAmount, totalAmount };
  }, [inputValue, mode, taxRate]);

  const quickAmounts = [
    { label: '1만원', value: 10000 },
    { label: '5만원', value: 50000 },
    { label: '10만원', value: 100000 },
    { label: '50만원', value: 500000 },
    { label: '100만원', value: 1000000 },
    { label: '500만원', value: 5000000 },
  ];

  const getPlaceholder = () => {
    switch (mode) {
      case 'fromTotal': return '합계금액 (부가세 포함)';
      case 'fromSupply': return '공급가액 (부가세 미포함)';
      case 'fromTax': return '부가세액';
    }
  };

  const getModeLabel = () => {
    switch (mode) {
      case 'fromTotal': return '합계금액';
      case 'fromSupply': return '공급가액';
      case 'fromTax': return '부가세액';
    }
  };

  return (
    <div className="space-y-6">
      {/* 모드 선택 */}
      <div className="space-y-2">
        <p className="font-semibold text-gray-700">📊 계산 방식 선택</p>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => setMode('fromTotal')}
            className={`py-3 px-2 rounded-xl font-medium text-sm transition-all ${
              mode === 'fromTotal'
                ? 'bg-ai-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            합계금액에서<br/>분리
          </button>
          <button
            onClick={() => setMode('fromSupply')}
            className={`py-3 px-2 rounded-xl font-medium text-sm transition-all ${
              mode === 'fromSupply'
                ? 'bg-ai-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            공급가액에서<br/>계산
          </button>
          <button
            onClick={() => setMode('fromTax')}
            className={`py-3 px-2 rounded-xl font-medium text-sm transition-all ${
              mode === 'fromTax'
                ? 'bg-ai-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            세액에서<br/>역산
          </button>
        </div>
      </div>

      {/* 세율 선택 */}
      <div className="space-y-2">
        <p className="font-semibold text-gray-700">📋 세율 선택</p>
        <div className="flex gap-2">
          {[10, 0].map((rate) => (
            <button
              key={rate}
              onClick={() => setTaxRate(rate)}
              className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                taxRate === rate
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {rate === 10 ? '일반과세 (10%)' : '면세 (0%)'}
            </button>
          ))}
        </div>
      </div>

      {/* 금액 입력 */}
      <div className="space-y-3">
        <label className="font-semibold text-gray-700 block">
          💰 {getModeLabel()} 입력
        </label>
        <div className="relative">
          <input
            type="text"
            value={inputValue ? formatMoney(parseFloat(inputValue)) : ''}
            onChange={(e) => handleInputChange(e.target.value)}
            className="w-full p-4 text-2xl font-bold text-center border-2 border-gray-200 rounded-xl focus:border-ai-primary focus:outline-none"
            placeholder={getPlaceholder()}
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg">원</span>
        </div>

        {/* 빠른 금액 선택 */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {quickAmounts.map((item) => (
            <button
              key={item.value}
              onClick={() => setInputValue(item.value.toString())}
              className="py-2 px-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* 결과 */}
      {parseFloat(inputValue) > 0 && (
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border-2 border-emerald-200">
          <h3 className="font-bold text-gray-800 mb-4 text-center">📝 계산 결과</h3>
          
          <div className="space-y-4">
            {/* 공급가액 */}
            <div className={`bg-white rounded-xl p-4 ${mode === 'fromSupply' ? 'ring-2 ring-ai-primary' : ''}`}>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">공급가액</p>
                  <p className="text-xs text-gray-400">(부가세 미포함)</p>
                </div>
                <p className="text-2xl font-bold text-gray-800">
                  {formatMoney(calculation.supplyAmount)}원
                </p>
              </div>
            </div>

            {/* 부가세 */}
            <div className={`bg-white rounded-xl p-4 ${mode === 'fromTax' ? 'ring-2 ring-ai-primary' : ''}`}>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">부가세액</p>
                  <p className="text-xs text-gray-400">({taxRate}%)</p>
                </div>
                <p className="text-2xl font-bold text-emerald-600">
                  {formatMoney(calculation.taxAmount)}원
                </p>
              </div>
            </div>

            {/* 합계 */}
            <div className={`bg-white rounded-xl p-4 border-2 border-emerald-300 ${mode === 'fromTotal' ? 'ring-2 ring-ai-primary' : ''}`}>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">합계금액</p>
                  <p className="text-xs text-gray-400">(부가세 포함)</p>
                </div>
                <p className="text-3xl font-bold text-emerald-700">
                  {formatMoney(calculation.totalAmount)}원
                </p>
              </div>
            </div>
          </div>

          {/* 계산식 */}
          <div className="mt-4 pt-4 border-t border-emerald-200">
            <p className="text-sm text-gray-600 text-center">
              {mode === 'fromTotal' && (
                <>공급가액 = {formatMoney(parseFloat(inputValue) || 0)} ÷ 1.{taxRate} = <span className="font-medium">{formatMoney(calculation.supplyAmount)}</span>원</>
              )}
              {mode === 'fromSupply' && (
                <>부가세 = {formatMoney(parseFloat(inputValue) || 0)} × {taxRate}% = <span className="font-medium">{formatMoney(calculation.taxAmount)}</span>원</>
              )}
              {mode === 'fromTax' && (
                <>공급가액 = {formatMoney(parseFloat(inputValue) || 0)} ÷ {taxRate}% = <span className="font-medium">{formatMoney(calculation.supplyAmount)}</span>원</>
              )}
            </p>
          </div>
        </div>
      )}

      {/* 복사 버튼 */}
      {parseFloat(inputValue) > 0 && (
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => navigator.clipboard.writeText(calculation.supplyAmount.toString())}
            className="py-3 px-4 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-medium transition-all"
          >
            📋 공급가액 복사
          </button>
          <button
            onClick={() => navigator.clipboard.writeText(calculation.taxAmount.toString())}
            className="py-3 px-4 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-medium transition-all"
          >
            📋 세액 복사
          </button>
          <button
            onClick={() => navigator.clipboard.writeText(calculation.totalAmount.toString())}
            className="py-3 px-4 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-medium transition-all"
          >
            📋 합계 복사
          </button>
        </div>
      )}

      {/* 참고 정보 */}
      <div className="bg-gray-50 rounded-xl p-4">
        <h3 className="font-bold text-gray-700 mb-3">💡 부가세 참고 정보</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <p>• <span className="font-medium">일반과세자:</span> 부가세율 10% 적용</p>
          <p>• <span className="font-medium">간이과세자:</span> 업종별 1.5%~4% 적용 (별도 계산 필요)</p>
          <p>• <span className="font-medium">면세사업자:</span> 부가세 면제 (의료, 교육 등)</p>
          <p>• <span className="font-medium">신고 기간:</span> 1기(1~6월) → 7/25까지, 2기(7~12월) → 다음해 1/25까지</p>
        </div>
      </div>

      {/* 빈 상태 */}
      {!parseFloat(inputValue) && (
        <div className="bg-gray-50 rounded-2xl p-8 text-center">
          <p className="text-4xl mb-4">🧾</p>
          <p className="text-gray-500">금액을 입력하면<br/>부가세가 자동으로 계산됩니다.</p>
        </div>
      )}
    </div>
  );
}
