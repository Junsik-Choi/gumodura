'use client';

import { useState, useMemo } from 'react';
import { useTranslatedTexts } from '@/lib/use-translations';

interface BmiResult {
  bmi: number;
  category: string;
  categoryColor: string;
  healthRisk: string;
  idealWeightMin: number;
  idealWeightMax: number;
  advice: string;
}

export default function BmiCalculator() {
  const [height, setHeight] = useState<string>('170');
  const [weight, setWeight] = useState<string>('65');
  const [age, setAge] = useState<string>('30');
  const [gender, setGender] = useState<'male' | 'female'>('male');

  const [
    // Labels
    heightLabel,
    weightLabel,
    ageLabel,
    genderLabel,
    male,
    female,
    // BMI Categories
    underweight,
    normal,
    overweight,
    obese1,
    obese2,
    morbidObese,
    // Health Risks
    riskUnderweight,
    riskNormal,
    riskOverweight,
    riskObese1,
    riskObese2,
    riskMorbidObese,
    // Advice
    adviceUnderweight,
    adviceNormal,
    adviceOverweight,
    adviceObese1,
    adviceObese2,
    adviceMorbidObese,
    // Results
    bmiIndex,
    bmiRange,
    normalWeightRange,
    weightDifference,
    excess,
    shortage,
    withinNormalRange,
    healthRisk,
    // BMI Table
    bmiStandard,
    category,
    bmiRangeLabel,
    lessThan,
    orMore,
    // Gauge labels
    underweightShort,
    normalShort,
    overweightShort,
    obese1Short,
    obese2Short,
    morbidObeseShort,
    // Notes
    notes,
    note1,
    note2,
    note3,
    note4,
  ] = useTranslatedTexts([
    // Labels
    '📏 키 (cm)',
    '⚖️ 몸무게 (kg)',
    '🎂 나이 (선택)',
    '👤 성별 (선택)',
    '👨 남성',
    '👩 여성',
    // BMI Categories
    '저체중',
    '정상',
    '과체중',
    '비만 (1단계)',
    '비만 (2단계)',
    '고도비만',
    // Health Risks
    '영양실조, 면역력 저하 위험',
    '낮음',
    '약간 높음',
    '높음 - 당뇨, 고혈압 위험',
    '매우 높음 - 심혈관 질환 위험',
    '심각 - 각종 합병증 위험',
    // Advice
    '균형 잡힌 식단과 적절한 영양 섭취가 필요해요.',
    '건강한 체중이에요! 현재 상태를 유지하세요.',
    '식이조절과 규칙적인 운동을 시작해보세요.',
    '생활습관 개선이 필요해요. 전문가 상담을 권장해요.',
    '의사와 상담하여 체계적인 체중 관리를 시작하세요.',
    '반드시 전문의 상담이 필요해요.',
    // Results
    '📊 BMI 지수',
    '📈 BMI 범위',
    '🎯 정상 체중 범위',
    '⚖️ 현재 체중과 차이',
    '초과',
    '부족',
    '정상 범위 내',
    '⚠️ 건강 위험도',
    // BMI Table
    '📋 대한비만학회 BMI 기준',
    '분류',
    'BMI 범위',
    '미만',
    '이상',
    // Gauge labels
    '저체중',
    '정상',
    '과체중',
    '비만1',
    '비만2',
    '고도',
    // Notes
    '⚠️ 참고사항',
    '• BMI는 건강의 한 지표일 뿐, 절대적인 기준이 아니에요',
    '• 근육량이 많은 운동선수는 BMI가 높게 나올 수 있어요',
    '• 정확한 건강 상태는 체지방률, 허리둘레 등을 함께 고려해야 해요',
    '• 건강 상담은 전문의와 함께 하세요',
  ]);

  const calculateBmi = useMemo(() => {
    return (height: number, weight: number): BmiResult | null => {
      if (height <= 0 || weight <= 0) return null;
      
      const heightM = height / 100;
      const bmi = weight / (heightM * heightM);
      
      let categoryText: string;
      let categoryColor: string;
      let healthRiskText: string;
      let adviceText: string;
      
      if (bmi < 18.5) {
        categoryText = underweight;
        categoryColor = 'text-blue-600';
        healthRiskText = riskUnderweight;
        adviceText = adviceUnderweight;
      } else if (bmi < 23) {
        categoryText = normal;
        categoryColor = 'text-green-600';
        healthRiskText = riskNormal;
        adviceText = adviceNormal;
      } else if (bmi < 25) {
        categoryText = overweight;
        categoryColor = 'text-yellow-600';
        healthRiskText = riskOverweight;
        adviceText = adviceOverweight;
      } else if (bmi < 30) {
        categoryText = obese1;
        categoryColor = 'text-orange-600';
        healthRiskText = riskObese1;
        adviceText = adviceObese1;
      } else if (bmi < 35) {
        categoryText = obese2;
        categoryColor = 'text-red-600';
        healthRiskText = riskObese2;
        adviceText = adviceObese2;
      } else {
        categoryText = morbidObese;
        categoryColor = 'text-red-700';
        healthRiskText = riskMorbidObese;
        adviceText = adviceMorbidObese;
      }
      
      const idealWeightMin = 18.5 * heightM * heightM;
      const idealWeightMax = 22.9 * heightM * heightM;
      
      return {
        bmi,
        category: categoryText,
        categoryColor,
        healthRisk: healthRiskText,
        idealWeightMin,
        idealWeightMax,
        advice: adviceText,
      };
    };
  }, [underweight, normal, overweight, obese1, obese2, morbidObese, riskUnderweight, riskNormal, riskOverweight, riskObese1, riskObese2, riskMorbidObese, adviceUnderweight, adviceNormal, adviceOverweight, adviceObese1, adviceObese2, adviceMorbidObese]);

  const result = useMemo(() => {
    return calculateBmi(parseFloat(height) || 0, parseFloat(weight) || 0);
  }, [height, weight, calculateBmi]);

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
            <label className="block font-medium text-gray-700 mb-2">{heightLabel}</label>
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
            <label className="block font-medium text-gray-700 mb-2">{weightLabel}</label>
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
            <label className="block font-medium text-gray-700 mb-2">{ageLabel}</label>
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
            <label className="block font-medium text-gray-700 mb-2">{genderLabel}</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setGender('male')}
                className={`py-3 rounded-xl font-medium transition-all ${
                  gender === 'male'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white border-2 border-gray-200 text-gray-600'
                }`}
              >
                {male}
              </button>
              <button
                onClick={() => setGender('female')}
                className={`py-3 rounded-xl font-medium transition-all ${
                  gender === 'female'
                    ? 'bg-pink-500 text-white'
                    : 'bg-white border-2 border-gray-200 text-gray-600'
                }`}
              >
                {female}
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
            <p className="text-lg opacity-90 mb-2">{bmiIndex}</p>
            <p className="text-6xl font-bold">{result.bmi.toFixed(1)}</p>
            <p className={`text-2xl font-bold mt-2 ${result.categoryColor.replace('text-', 'text-white/')}`}>
              {result.category}
            </p>
          </div>

          {/* BMI 게이지 */}
          <div className="bg-gray-50 rounded-2xl p-5">
            <h3 className="font-bold text-gray-800 mb-4">{bmiRange}</h3>
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
              <span>{underweightShort}</span>
              <span>{normalShort}</span>
              <span>{overweightShort}</span>
              <span>{obese1Short}</span>
              <span>{obese2Short}</span>
              <span>{morbidObeseShort}</span>
            </div>
          </div>

          {/* 상세 정보 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-green-50 rounded-xl p-4">
              <p className="text-sm text-green-700 mb-1">{normalWeightRange}</p>
              <p className="text-xl font-bold text-green-800">
                {result.idealWeightMin.toFixed(1)} ~ {result.idealWeightMax.toFixed(1)} kg
              </p>
            </div>
            <div className="bg-blue-50 rounded-xl p-4">
              <p className="text-sm text-blue-700 mb-1">{weightDifference}</p>
              <p className="text-xl font-bold text-blue-800">
                {parseFloat(weight) > result.idealWeightMax
                  ? `+${(parseFloat(weight) - result.idealWeightMax).toFixed(1)} kg ${excess}`
                  : parseFloat(weight) < result.idealWeightMin
                  ? `-${(result.idealWeightMin - parseFloat(weight)).toFixed(1)} kg ${shortage}`
                  : withinNormalRange}
              </p>
            </div>
          </div>

          {/* 건강 위험도 */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-bold text-gray-700 mb-3">{healthRisk}</h3>
            <p className={`font-medium ${result.categoryColor}`}>{result.healthRisk}</p>
            <p className="text-gray-600 mt-2">{result.advice}</p>
          </div>
        </>
      )}

      {/* BMI 기준표 */}
      <div className="bg-gray-50 rounded-xl p-4">
        <h3 className="font-bold text-gray-700 mb-3">{bmiStandard}</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="py-2 text-left">{category}</th>
              <th className="py-2 text-right">{bmiRangeLabel}</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-100">
              <td className="py-2 text-blue-600">{underweight}</td>
              <td className="py-2 text-right">18.5 {lessThan}</td>
            </tr>
            <tr className="border-b border-gray-100">
              <td className="py-2 text-green-600">{normal}</td>
              <td className="py-2 text-right">18.5 ~ 22.9</td>
            </tr>
            <tr className="border-b border-gray-100">
              <td className="py-2 text-yellow-600">{overweight}</td>
              <td className="py-2 text-right">23 ~ 24.9</td>
            </tr>
            <tr className="border-b border-gray-100">
              <td className="py-2 text-orange-600">{obese1}</td>
              <td className="py-2 text-right">25 ~ 29.9</td>
            </tr>
            <tr className="border-b border-gray-100">
              <td className="py-2 text-red-600">{obese2}</td>
              <td className="py-2 text-right">30 ~ 34.9</td>
            </tr>
            <tr>
              <td className="py-2 text-red-700">{morbidObese}</td>
              <td className="py-2 text-right">35 {orMore}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 참고사항 */}
      <div className="bg-yellow-50 rounded-xl p-4">
        <h3 className="font-bold text-yellow-800 mb-2">{notes}</h3>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>{note1}</li>
          <li>{note2}</li>
          <li>{note3}</li>
          <li>{note4}</li>
        </ul>
      </div>
    </div>
  );
}
