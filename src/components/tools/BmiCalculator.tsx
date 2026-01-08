'use client';

import { useState, useMemo } from 'react';

interface BmiResult {
  bmi: number;
  category: string;
  categoryColor: string;
  healthRisk: string;
  idealWeightMin: number;
  idealWeightMax: number;
  advice: string;
}

function calculateBmi(height: number, weight: number): BmiResult | null {
  if (height <= 0 || weight <= 0) return null;
  
  const heightM = height / 100;
  const bmi = weight / (heightM * heightM);
  
  let category: string;
  let categoryColor: string;
  let healthRisk: string;
  let advice: string;
  
  if (bmi < 18.5) {
    category = '저체중';
    categoryColor = 'text-blue-600';
    healthRisk = '영양실조, 면역력 저하 위험';
    advice = '균형 잡힌 식단과 적절한 영양 섭취가 필요해요.';
  } else if (bmi < 23) {
    category = '정상';
    categoryColor = 'text-green-600';
    healthRisk = '낮음';
    advice = '건강한 체중이에요! 현재 상태를 유지하세요.';
  } else if (bmi < 25) {
    category = '과체중';
    categoryColor = 'text-yellow-600';
    healthRisk = '약간 높음';
    advice = '식이조절과 규칙적인 운동을 시작해보세요.';
  } else if (bmi < 30) {
    category = '비만 (1단계)';
    categoryColor = 'text-orange-600';
    healthRisk = '높음 - 당뇨, 고혈압 위험';
    advice = '생활습관 개선이 필요해요. 전문가 상담을 권장해요.';
  } else if (bmi < 35) {
    category = '비만 (2단계)';
    categoryColor = 'text-red-600';
    healthRisk = '매우 높음 - 심혈관 질환 위험';
    advice = '의사와 상담하여 체계적인 체중 관리를 시작하세요.';
  } else {
    category = '고도비만';
    categoryColor = 'text-red-700';
    healthRisk = '심각 - 각종 합병증 위험';
    advice = '반드시 전문의 상담이 필요해요.';
  }
  
  // 정상 BMI 범위(18.5-22.9)에 해당하는 체중 계산
  const idealWeightMin = 18.5 * heightM * heightM;
  const idealWeightMax = 22.9 * heightM * heightM;
  
  return {
    bmi,
    category,
    categoryColor,
    healthRisk,
    idealWeightMin,
    idealWeightMax,
    advice,
  };
}

export default function BmiCalculator() {
  const [height, setHeight] = useState<string>('170');
  const [weight, setWeight] = useState<string>('65');
  const [age, setAge] = useState<string>('30');
  const [gender, setGender] = useState<'male' | 'female'>('male');

  const result = useMemo(() => {
    return calculateBmi(parseFloat(height) || 0, parseFloat(weight) || 0);
  }, [height, weight]);

  // BMI 게이지 위치 계산 (15-40 범위)
  const gaugePosition = useMemo(() => {
    if (!result) return 0;
    const minBmi = 15;
    const maxBmi = 40;
    const position = ((result.bmi - minBmi) / (maxBmi - minBmi)) * 100;
    return Math.max(0, Math.min(100, position));
  }, [result]);

  return (
    <div className="space-y-6">
      {/* 입력 */}
      <div className="bg-gray-50 rounded-2xl p-5 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium text-gray-700 mb-2">📏 키 (cm)</label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="w-full p-4 text-xl text-center border-2 border-gray-200 rounded-xl focus:border-ai-primary focus:outline-none"
              placeholder="170"
              min="100"
              max="250"
            />
          </div>
          <div>
            <label className="block font-medium text-gray-700 mb-2">⚖️ 몸무게 (kg)</label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full p-4 text-xl text-center border-2 border-gray-200 rounded-xl focus:border-ai-primary focus:outline-none"
              placeholder="65"
              min="20"
              max="300"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium text-gray-700 mb-2">🎂 나이 (선택)</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full p-3 text-center border-2 border-gray-200 rounded-xl focus:border-ai-primary focus:outline-none"
              placeholder="30"
              min="1"
              max="120"
            />
          </div>
          <div>
            <label className="block font-medium text-gray-700 mb-2">👤 성별 (선택)</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setGender('male')}
                className={`py-3 rounded-xl font-medium transition-all ${
                  gender === 'male'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white border-2 border-gray-200 text-gray-600'
                }`}
              >
                👨 남성
              </button>
              <button
                onClick={() => setGender('female')}
                className={`py-3 rounded-xl font-medium transition-all ${
                  gender === 'female'
                    ? 'bg-pink-500 text-white'
                    : 'bg-white border-2 border-gray-200 text-gray-600'
                }`}
              >
                👩 여성
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 결과 */}
      {result && (
        <>
          {/* BMI 수치 */}
          <div className="bg-gradient-to-br from-ai-primary to-purple-600 rounded-2xl p-6 text-white text-center">
            <p className="text-lg opacity-90 mb-2">📊 BMI 지수</p>
            <p className="text-6xl font-bold">{result.bmi.toFixed(1)}</p>
            <p className={`text-2xl font-bold mt-2 ${result.categoryColor.replace('text-', 'text-white/')}`}>
              {result.category}
            </p>
          </div>

          {/* BMI 게이지 */}
          <div className="bg-gray-50 rounded-2xl p-5">
            <h3 className="font-bold text-gray-800 mb-4">📈 BMI 범위</h3>
            <div className="relative h-8 rounded-full overflow-hidden mb-2">
              <div className="absolute inset-0 flex">
                <div className="bg-blue-400 flex-1" title="저체중"></div>
                <div className="bg-green-400 flex-1" title="정상"></div>
                <div className="bg-yellow-400 flex-1" title="과체중"></div>
                <div className="bg-orange-400 flex-1" title="비만1"></div>
                <div className="bg-red-400 flex-1" title="비만2"></div>
                <div className="bg-red-600 flex-1" title="고도비만"></div>
              </div>
              {/* 마커 */}
              <div
                className="absolute top-0 w-1 h-full bg-black shadow-lg transform -translate-x-1/2"
                style={{ left: `${gaugePosition}%` }}
              >
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                  {result.bmi.toFixed(1)}
                </div>
              </div>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>15</span>
              <span>18.5</span>
              <span>23</span>
              <span>25</span>
              <span>30</span>
              <span>35</span>
              <span>40</span>
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>저체중</span>
              <span>정상</span>
              <span>과체중</span>
              <span>비만1</span>
              <span>비만2</span>
              <span>고도</span>
            </div>
          </div>

          {/* 상세 정보 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-green-50 rounded-xl p-4">
              <p className="text-sm text-green-700 mb-1">🎯 정상 체중 범위</p>
              <p className="text-xl font-bold text-green-800">
                {result.idealWeightMin.toFixed(1)} ~ {result.idealWeightMax.toFixed(1)} kg
              </p>
            </div>
            <div className="bg-blue-50 rounded-xl p-4">
              <p className="text-sm text-blue-700 mb-1">⚖️ 현재 체중과 차이</p>
              <p className="text-xl font-bold text-blue-800">
                {parseFloat(weight) > result.idealWeightMax
                  ? `+${(parseFloat(weight) - result.idealWeightMax).toFixed(1)} kg 초과`
                  : parseFloat(weight) < result.idealWeightMin
                  ? `-${(result.idealWeightMin - parseFloat(weight)).toFixed(1)} kg 부족`
                  : '정상 범위 내'}
              </p>
            </div>
          </div>

          {/* 건강 위험도 */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-bold text-gray-700 mb-3">⚠️ 건강 위험도</h3>
            <p className={`font-medium ${result.categoryColor}`}>{result.healthRisk}</p>
            <p className="text-gray-600 mt-2">{result.advice}</p>
          </div>
        </>
      )}

      {/* BMI 기준표 */}
      <div className="bg-gray-50 rounded-xl p-4">
        <h3 className="font-bold text-gray-700 mb-3">📋 대한비만학회 BMI 기준</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="py-2 text-left">분류</th>
              <th className="py-2 text-right">BMI 범위</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-100">
              <td className="py-2 text-blue-600">저체중</td>
              <td className="py-2 text-right">18.5 미만</td>
            </tr>
            <tr className="border-b border-gray-100">
              <td className="py-2 text-green-600">정상</td>
              <td className="py-2 text-right">18.5 ~ 22.9</td>
            </tr>
            <tr className="border-b border-gray-100">
              <td className="py-2 text-yellow-600">과체중</td>
              <td className="py-2 text-right">23 ~ 24.9</td>
            </tr>
            <tr className="border-b border-gray-100">
              <td className="py-2 text-orange-600">비만 (1단계)</td>
              <td className="py-2 text-right">25 ~ 29.9</td>
            </tr>
            <tr className="border-b border-gray-100">
              <td className="py-2 text-red-600">비만 (2단계)</td>
              <td className="py-2 text-right">30 ~ 34.9</td>
            </tr>
            <tr>
              <td className="py-2 text-red-700">고도비만</td>
              <td className="py-2 text-right">35 이상</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 참고사항 */}
      <div className="bg-yellow-50 rounded-xl p-4">
        <h3 className="font-bold text-yellow-800 mb-2">⚠️ 참고사항</h3>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• BMI는 건강의 한 지표일 뿐, 절대적인 기준이 아니에요</li>
          <li>• 근육량이 많은 운동선수는 BMI가 높게 나올 수 있어요</li>
          <li>• 정확한 건강 상태는 체지방률, 허리둘레 등을 함께 고려해야 해요</li>
          <li>• 건강 상담은 전문의와 함께 하세요</li>
        </ul>
      </div>
    </div>
  );
}
