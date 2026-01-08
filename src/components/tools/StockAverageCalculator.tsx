'use client';

import { useState, useMemo } from 'react';
import { useTranslatedTexts } from '@/lib/use-translations';

interface StockEntry {
  id: string;
  price: string;
  quantity: string;
}

function formatMoney(amount: number, decimals: number = 0): string {
  if (decimals > 0) {
    return amount.toLocaleString('ko-KR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  }
  return amount.toLocaleString('ko-KR');
}

export default function StockAverageCalculator() {
  const [
    labelInputTitle,
    labelReset,
    labelHoldingStock,
    labelAveragingDown,
    labelDelete,
    labelBuyPrice,
    labelWon,
    labelQuantity,
    labelShares,
    labelPurchaseAmount,
    labelAddAveraging,
    labelAveragePrice,
    labelTotalPurchase,
    labelTotalQuantity,
    labelPurchaseSummary,
    labelHolding,
    labelNth,
    labelTargetSimulation,
    placeholderTargetPrice,
    labelEvaluation,
    labelProfitLoss,
    labelReturnRate,
    labelBreakeven,
    labelCurrentAverage,
    labelBreakevenDesc,
    labelDisclaimer,
    labelEmptyState1,
    labelEmptyState2,
  ] = useTranslatedTexts([
    '📈 매수 내역 입력',
    '🔄 초기화',
    '🎯 보유 주식',
    '차 물타기',
    '삭제',
    '매수 단가',
    '원',
    '수량',
    '주',
    '매수금액:',
    '+ 물타기 추가',
    '평균 매수 단가',
    '총 매수 금액',
    '총 보유 수량',
    '📋 매수 내역 요약',
    '보유',
    '차',
    '🎯 목표가 시뮬레이션',
    '목표가를 입력하세요',
    '평가금액',
    '수익/손실',
    '수익률:',
    '💡 손익분기점',
    '현재 평균 단가',
    '에서 원금 회복을 위한 최소 매도가입니다.',
    '* 증권사 수수료, 세금(0.23%) 미포함 기준',
    '매수 단가와 수량을 입력하면',
    '평균 단가가 계산됩니다.',
  ]);

  const [entries, setEntries] = useState<StockEntry[]>([
    { id: '1', price: '', quantity: '' },
    { id: '2', price: '', quantity: '' },
  ]);

  const addEntry = () => {
    setEntries([...entries, { id: Date.now().toString(), price: '', quantity: '' }]);
  };

  const removeEntry = (id: string) => {
    if (entries.length > 2) {
      setEntries(entries.filter(e => e.id !== id));
    }
  };

  const updateEntry = (id: string, field: 'price' | 'quantity', value: string) => {
    // 숫자만 허용 (소수점 포함)
    const numericValue = value.replace(/[^0-9.]/g, '');
    setEntries(entries.map(e => e.id === id ? { ...e, [field]: numericValue } : e));
  };

  const resetAll = () => {
    setEntries([
      { id: '1', price: '', quantity: '' },
      { id: '2', price: '', quantity: '' },
    ]);
  };

  // 계산
  const calculation = useMemo(() => {
    let totalCost = 0;
    let totalQuantity = 0;
    const validEntries: { price: number; quantity: number; cost: number }[] = [];

    for (const entry of entries) {
      const price = parseFloat(entry.price) || 0;
      const quantity = parseFloat(entry.quantity) || 0;
      if (price > 0 && quantity > 0) {
        const cost = price * quantity;
        totalCost += cost;
        totalQuantity += quantity;
        validEntries.push({ price, quantity, cost });
      }
    }

    const averagePrice = totalQuantity > 0 ? totalCost / totalQuantity : 0;
    
    return {
      totalCost,
      totalQuantity,
      averagePrice,
      validEntries,
    };
  }, [entries]);

  // 목표가 시뮬레이션
  const [targetPrice, setTargetPrice] = useState<string>('');
  const targetPriceNum = parseFloat(targetPrice) || 0;
  
  const profitLoss = useMemo(() => {
    if (targetPriceNum <= 0 || calculation.totalQuantity === 0) return null;
    
    const targetValue = targetPriceNum * calculation.totalQuantity;
    const profit = targetValue - calculation.totalCost;
    const profitRate = (profit / calculation.totalCost) * 100;
    
    return { targetValue, profit, profitRate };
  }, [targetPriceNum, calculation]);

  return (
    <div className="space-y-6">
      {/* 입력 섹션 */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-gray-800">{labelInputTitle}</h3>
          <button
            onClick={resetAll}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            {labelReset}
          </button>
        </div>

        {entries.map((entry, index) => (
          <div key={entry.id} className="bg-gray-50 rounded-xl p-4">
            <div className="flex justify-between items-center mb-3">
              <span className="font-medium text-gray-700">
                {index === 0 ? labelHoldingStock : `➕ ${index}${labelAveragingDown}`}
              </span>
              {entries.length > 2 && index > 1 && (
                <button
                  onClick={() => removeEntry(entry.id)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  {labelDelete}
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-gray-500 mb-1 block">{labelBuyPrice}</label>
                <div className="relative">
                  <input
                    type="text"
                    value={entry.price ? formatMoney(parseFloat(entry.price)) : ''}
                    onChange={(e) => updateEntry(entry.id, 'price', e.target.value)}
                    className="w-full p-3 text-right font-medium border-2 border-gray-200 rounded-lg focus:border-ai-primary focus:outline-none"
                    placeholder="0"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">{labelWon}</span>
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-500 mb-1 block">{labelQuantity}</label>
                <div className="relative">
                  <input
                    type="text"
                    value={entry.quantity ? formatMoney(parseFloat(entry.quantity)) : ''}
                    onChange={(e) => updateEntry(entry.id, 'quantity', e.target.value)}
                    className="w-full p-3 text-right font-medium border-2 border-gray-200 rounded-lg focus:border-ai-primary focus:outline-none"
                    placeholder="0"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">{labelShares}</span>
                </div>
              </div>
            </div>
            {entry.price && entry.quantity && (
              <div className="mt-2 text-right text-sm text-gray-500">
                {labelPurchaseAmount} {formatMoney((parseFloat(entry.price) || 0) * (parseFloat(entry.quantity) || 0))}{labelWon}
              </div>
            )}
          </div>
        ))}

        <button
          onClick={addEntry}
          className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-ai-primary hover:text-ai-primary transition-all"
        >
          {labelAddAveraging}
        </button>
      </div>

      {/* 결과 - 평균 단가 */}
      {calculation.totalQuantity > 0 && (
        <>
          <div className="bg-gradient-to-br from-ai-primary to-purple-600 rounded-2xl p-6 text-white">
            <div className="text-center">
              <p className="text-lg opacity-90 mb-2">{labelAveragePrice}</p>
              <p className="text-4xl sm:text-5xl font-bold">
                {formatMoney(Math.round(calculation.averagePrice))}{labelWon}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-white/20">
              <div className="text-center">
                <p className="text-sm opacity-80">{labelTotalPurchase}</p>
                <p className="text-xl font-bold">{formatMoney(calculation.totalCost)}{labelWon}</p>
              </div>
              <div className="text-center">
                <p className="text-sm opacity-80">{labelTotalQuantity}</p>
                <p className="text-xl font-bold">{formatMoney(calculation.totalQuantity)}{labelShares}</p>
              </div>
            </div>
          </div>

          {/* 매수 내역 요약 */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-bold text-gray-800 mb-3">{labelPurchaseSummary}</h3>
            <div className="space-y-2">
              {calculation.validEntries.map((entry, index) => {
                const diffFromAvg = entry.price - calculation.averagePrice;
                const diffPercent = (diffFromAvg / calculation.averagePrice) * 100;
                
                return (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                    <div>
                      <span className="font-medium">{index === 0 ? labelHolding : `${index}${labelNth}`}</span>
                      <span className="text-gray-500 text-sm ml-2">
                        {formatMoney(entry.price)}{labelWon} × {formatMoney(entry.quantity)}{labelShares}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-medium">{formatMoney(entry.cost)}{labelWon}</span>
                      <span className={`text-xs ml-2 ${diffFromAvg > 0 ? 'text-red-500' : 'text-blue-500'}`}>
                        ({diffFromAvg > 0 ? '+' : ''}{diffPercent.toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 목표가 시뮬레이션 */}
          <div className="bg-gray-50 rounded-xl p-5">
            <h3 className="font-bold text-gray-800 mb-4">{labelTargetSimulation}</h3>
            <div className="relative mb-4">
              <input
                type="text"
                value={targetPrice ? formatMoney(parseFloat(targetPrice)) : ''}
                onChange={(e) => setTargetPrice(e.target.value.replace(/[^0-9]/g, ''))}
                className="w-full p-4 text-xl font-bold text-center border-2 border-gray-200 rounded-xl focus:border-ai-primary focus:outline-none"
                placeholder={placeholderTargetPrice}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">{labelWon}</span>
            </div>

            {/* 빠른 선택 버튼 */}
            <div className="grid grid-cols-5 gap-2 mb-4">
              {[-20, -10, 0, 10, 20].map((percent) => {
                const targetVal = Math.round(calculation.averagePrice * (1 + percent / 100));
                return (
                  <button
                    key={percent}
                    onClick={() => setTargetPrice(targetVal.toString())}
                    className={`py-2 px-2 rounded-lg text-sm font-medium transition-all ${
                      percent === 0
                        ? 'bg-gray-200 text-gray-700'
                        : percent > 0
                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                        : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                    }`}
                  >
                    {percent > 0 ? '+' : ''}{percent}%
                  </button>
                );
              })}
            </div>

            {profitLoss && (
              <div className={`rounded-xl p-4 ${profitLoss.profit >= 0 ? 'bg-red-50' : 'bg-blue-50'}`}>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">{labelEvaluation}</p>
                    <p className="text-lg font-bold">{formatMoney(profitLoss.targetValue)}{labelWon}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{labelProfitLoss}</p>
                    <p className={`text-lg font-bold ${profitLoss.profit >= 0 ? 'text-red-600' : 'text-blue-600'}`}>
                      {profitLoss.profit >= 0 ? '+' : ''}{formatMoney(profitLoss.profit)}{labelWon}
                    </p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-200 text-center">
                  <span className="text-gray-600">{labelReturnRate} </span>
                  <span className={`text-2xl font-bold ${profitLoss.profit >= 0 ? 'text-red-600' : 'text-blue-600'}`}>
                    {profitLoss.profitRate >= 0 ? '+' : ''}{profitLoss.profitRate.toFixed(2)}%
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* 손익분기점 계산 */}
          <div className="bg-yellow-50 rounded-xl p-4">
            <h3 className="font-bold text-yellow-800 mb-2">{labelBreakeven}</h3>
            <p className="text-yellow-700">
              {labelCurrentAverage} <span className="font-bold">{formatMoney(Math.round(calculation.averagePrice))}{labelWon}</span>
              {labelBreakevenDesc}
            </p>
            <p className="text-sm text-yellow-600 mt-2">
              {labelDisclaimer}
            </p>
          </div>
        </>
      )}

      {/* 빈 상태 */}
      {calculation.totalQuantity === 0 && (
        <div className="bg-gray-50 rounded-2xl p-8 text-center">
          <p className="text-4xl mb-4">📊</p>
          <p className="text-gray-500">{labelEmptyState1}<br/>{labelEmptyState2}</p>
        </div>
      )}
    </div>
  );
}
