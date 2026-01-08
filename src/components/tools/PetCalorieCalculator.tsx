'use client';

import { useState, useMemo } from 'react';
import { useTranslatedTexts } from '@/lib/use-translations';

interface PetCalorieResult {
  rer: number;  // Resting Energy Requirement
  der: number;  // Daily Energy Requirement
  foodAmount: number;
  description: string;
}

type PetType = 'dog' | 'cat';
type ActivityLevel = 'low' | 'normal' | 'high';
type LifeStage = 'puppy' | 'adult' | 'senior' | 'neutered' | 'weight-loss' | 'weight-gain';

// DER 계수 (RER에 곱함)
const DER_FACTORS = {
  dog: {
    puppy: { factor: 2.5, label: '성장기 (4개월 미만)' },
    adult: { factor: 1.8, label: '일반 성견' },
    senior: { factor: 1.4, label: '노령견 (7세 이상)' },
    neutered: { factor: 1.6, label: '중성화된 성견' },
    'weight-loss': { factor: 1.0, label: '체중 감량 필요' },
    'weight-gain': { factor: 1.7, label: '체중 증가 필요' },
  },
  cat: {
    puppy: { factor: 2.5, label: '성장기 (1세 미만)' },
    adult: { factor: 1.4, label: '일반 성묘' },
    senior: { factor: 1.1, label: '노령묘 (7세 이상)' },
    neutered: { factor: 1.2, label: '중성화된 성묘' },
    'weight-loss': { factor: 0.8, label: '체중 감량 필요' },
    'weight-gain': { factor: 1.3, label: '체중 증가 필요' },
  },
};

// 활동량 보정 계수
const ACTIVITY_FACTORS = {
  low: { factor: 0.9, label: '낮음 (집에서 주로 생활)' },
  normal: { factor: 1.0, label: '보통 (일반적인 활동)' },
  high: { factor: 1.3, label: '높음 (활동량이 많음)' },
};

function calculatePetCalories(
  petType: PetType,
  weight: number,
  lifeStage: LifeStage,
  activityLevel: ActivityLevel,
  foodCalorie: number  // kcal/g
): PetCalorieResult | null {
  if (weight <= 0) return null;

  // RER = 70 × (체중kg)^0.75
  const rer = 70 * Math.pow(weight, 0.75);
  
  // DER = RER × 생애주기 계수 × 활동량 계수
  const stageData = DER_FACTORS[petType][lifeStage];
  const activityData = ACTIVITY_FACTORS[activityLevel];
  
  const der = rer * stageData.factor * activityData.factor;
  
  // 사료 급여량 (g/day)
  const foodAmount = foodCalorie > 0 ? der / foodCalorie : 0;
  
  return {
    rer: Math.round(rer),
    der: Math.round(der),
    foodAmount: Math.round(foodAmount),
    description: `${stageData.label}, ${activityData.label}`,
  };
}

export default function PetCalorieCalculator() {
  const [petType, setPetType] = useState<PetType>('dog');
  const [weight, setWeight] = useState<string>('10');
  const [lifeStage, setLifeStage] = useState<LifeStage>('adult');
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('normal');
  const [foodCalorie, setFoodCalorie] = useState<string>('3.5');

  const [
    dog,
    cat,
    weightLabel,
    weightPlaceholder,
    dogWeightHint,
    catWeightHint,
    lifeStageLabel,
    activityLabel,
    activityLow,
    activityNormal,
    activityHigh,
    foodCalorieLabel,
    foodCaloriePlaceholder,
    foodCalorieHint,
    dailyCalorie,
    recommendedFoodAmount,
    rer,
    rerDesc,
    der,
    derDesc,
    feedingGuide,
    feedingGuide2,
    feedingGuide4,
    dogWeightGuide,
    catWeightGuide,
    sizeHeader,
    breedHeader,
    weightRangeHeader,
    toyDog,
    smallDog,
    mediumDog,
    largeDog,
    giantDog,
    singapura,
    koreanShorthair,
    persianSiamese,
    britishShorthair,
    maineCoon,
    notes,
    note1,
    note2,
    note3,
    note4,
    dogPuppy,
    dogAdult,
    dogSenior,
    dogNeutered,
    dogWeightLoss,
    dogWeightGain,
    catPuppy,
    catAdult,
    catSenior,
    catNeutered,
    catWeightLoss,
    catWeightGain,
    activityLowFull,
    activityNormalFull,
    activityHighFull,
  ] = useTranslatedTexts([
    '🐕 강아지',
    '🐈 고양이',
    '⚖️ 체중 (kg)',
    '예: 10',
    '소형견 3-10kg, 중형견 10-25kg, 대형견 25kg 이상',
    '일반 고양이 3-6kg',
    '🎂 생애주기 / 상태',
    '🏃 활동량',
    '🐢 낮음',
    '🐕 보통',
    '🏃 높음',
    '🍽️ 사료 열량 (kcal/g)',
    '예: 3.5',
    '사료 포장지 뒷면에서 확인 (일반 사료 약 3.5kcal/g)',
    '🍽️ 1일 권장 칼로리',
    '💡 권장 사료 급여량',
    '🛋️ 기초대사량 (RER)',
    '아무것도 안 해도 필요한 에너지',
    '🏃 일일필요량 (DER)',
    '활동량을 고려한 에너지',
    '📋 급여 가이드',
    '2~3회로 나누어 급여하는 것이 좋아요',
    '항상 신선한 물을 충분히 제공하세요',
    '🐕 강아지 적정 체중 가이드',
    '🐈 고양이 적정 체중 가이드',
    '크기',
    '품종',
    '체중 범위',
    '초소형견 (치와와, 요크셔테리어)',
    '소형견 (말티즈, 푸들, 시츄)',
    '중형견 (비글, 코카스패니얼)',
    '대형견 (리트리버, 진돗개)',
    '초대형견 (그레이트데인)',
    '싱가푸라',
    '코리안 숏헤어 / 일반 고양이',
    '페르시안, 샴',
    '브리티시 숏헤어',
    '메인쿤',
    '⚠️ 참고사항',
    '• 이 계산기는 일반적인 가이드라인이며, 개체별 차이가 있어요',
    '• 급격한 체중 변화가 있다면 수의사와 상담하세요',
    '• 임신/수유 중인 경우 별도의 영양 요구량이 필요해요',
    '• 질병이 있는 경우 수의사의 처방을 따르세요',
    '성장기 (4개월 미만)',
    '일반 성견',
    '노령견 (7세 이상)',
    '중성화된 성견',
    '체중 감량 필요',
    '체중 증가 필요',
    '성장기 (1세 미만)',
    '일반 성묘',
    '노령묘 (7세 이상)',
    '중성화된 성묘',
    '체중 감량 필요',
    '체중 증가 필요',
    '낮음 (집에서 주로 생활)',
    '보통 (일반적인 활동)',
    '높음 (활동량이 많음)',
  ]);

  // Translated DER factors
  const translatedDerFactors = {
    dog: {
      puppy: { factor: 2.5, label: dogPuppy },
      adult: { factor: 1.8, label: dogAdult },
      senior: { factor: 1.4, label: dogSenior },
      neutered: { factor: 1.6, label: dogNeutered },
      'weight-loss': { factor: 1.0, label: dogWeightLoss },
      'weight-gain': { factor: 1.7, label: dogWeightGain },
    },
    cat: {
      puppy: { factor: 2.5, label: catPuppy },
      adult: { factor: 1.4, label: catAdult },
      senior: { factor: 1.1, label: catSenior },
      neutered: { factor: 1.2, label: catNeutered },
      'weight-loss': { factor: 0.8, label: catWeightLoss },
      'weight-gain': { factor: 1.3, label: catWeightGain },
    },
  };

  const result = useMemo(() => {
    return calculatePetCalories(
      petType,
      parseFloat(weight) || 0,
      lifeStage,
      activityLevel,
      parseFloat(foodCalorie) || 0
    );
  }, [petType, weight, lifeStage, activityLevel, foodCalorie]);

  return (
    <div className="space-y-6">
      {/* 반려동물 선택 */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => setPetType('dog')}
          className={`py-6 rounded-2xl text-2xl font-bold transition-all ${
            petType === 'dog'
              ? 'bg-amber-500 text-white shadow-lg'
              : 'bg-gray-100 text-gray-500'
          }`}
        >
          {dog}
        </button>
        <button
          onClick={() => setPetType('cat')}
          className={`py-6 rounded-2xl text-2xl font-bold transition-all ${
            petType === 'cat'
              ? 'bg-purple-500 text-white shadow-lg'
              : 'bg-gray-100 text-gray-500'
          }`}
        >
          {cat}
        </button>
      </div>

      {/* 입력 */}
      <div className="bg-gray-50 rounded-2xl p-5 space-y-5">
        {/* 체중 */}
        <div>
          <label className="block font-medium text-gray-700 mb-2">{weightLabel}</label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full p-4 text-xl text-center border-2 border-gray-200 rounded-xl focus:border-ai-primary focus:outline-none"
            placeholder={weightPlaceholder}
            min="0.1"
            max="100"
            step="0.1"
          />
          <p className="text-sm text-gray-500 mt-1">
            {petType === 'dog' ? dogWeightHint : catWeightHint}
          </p>
        </div>

        {/* 생애주기 */}
        <div>
          <label className="block font-medium text-gray-700 mb-2">{lifeStageLabel}</label>
          <div className="grid grid-cols-2 gap-2">
            {(Object.entries(translatedDerFactors[petType]) as [LifeStage, { factor: number; label: string }][]).map(
              ([stage, data]) => (
                <button
                  key={stage}
                  onClick={() => setLifeStage(stage)}
                  className={`py-3 px-2 rounded-xl text-sm font-medium transition-all ${
                    lifeStage === stage
                      ? 'bg-ai-primary text-white'
                      : 'bg-white border-2 border-gray-200 text-gray-600'
                  }`}
                >
                  {data.label}
                </button>
              )
            )}
          </div>
        </div>

        {/* 활동량 */}
        <div>
          <label className="block font-medium text-gray-700 mb-2">{activityLabel}</label>
          <div className="grid grid-cols-3 gap-2">
            {(['low', 'normal', 'high'] as ActivityLevel[]).map(
              (level) => (
                <button
                  key={level}
                  onClick={() => setActivityLevel(level)}
                  className={`py-3 px-2 rounded-xl text-sm font-medium transition-all ${
                    activityLevel === level
                      ? 'bg-green-500 text-white'
                      : 'bg-white border-2 border-gray-200 text-gray-600'
                  }`}
                >
                  {level === 'low' ? activityLow : level === 'normal' ? activityNormal : activityHigh}
                </button>
              )
            )}
          </div>
        </div>

        {/* 사료 칼로리 */}
        <div>
          <label className="block font-medium text-gray-700 mb-2">{foodCalorieLabel}</label>
          <input
            type="number"
            value={foodCalorie}
            onChange={(e) => setFoodCalorie(e.target.value)}
            className="w-full p-3 text-center border-2 border-gray-200 rounded-xl focus:border-ai-primary focus:outline-none"
            placeholder={foodCaloriePlaceholder}
            min="1"
            max="10"
            step="0.1"
          />
          <p className="text-sm text-gray-500 mt-1">
            {foodCalorieHint}
          </p>
        </div>
      </div>

      {/* 결과 */}
      {result && (
        <>
          {/* 메인 결과 */}
          <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-white">
            <div className="text-center mb-4">
              <p className="text-lg opacity-90">{dailyCalorie}</p>
              <p className="text-5xl font-bold mt-1">{result.der.toLocaleString()}</p>
              <p className="text-2xl opacity-90">kcal/day</p>
            </div>
            
            {parseFloat(foodCalorie) > 0 && (
              <div className="bg-white/20 rounded-xl p-4 text-center">
                <p className="opacity-90">{recommendedFoodAmount}</p>
                <p className="text-3xl font-bold">{result.foodAmount} g/day</p>
                <p className="text-sm opacity-80 mt-1">
                  ({Math.round(result.foodAmount / 2)}g × 2회 또는 {Math.round(result.foodAmount / 3)}g × 3회)
                </p>
              </div>
            )}
          </div>

          {/* 상세 칼로리 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-xl p-4 text-center">
              <p className="text-sm text-blue-700 mb-1">{rer}</p>
              <p className="text-2xl font-bold text-blue-800">{result.rer} kcal</p>
              <p className="text-xs text-blue-600 mt-1">{rerDesc}</p>
            </div>
            <div className="bg-purple-50 rounded-xl p-4 text-center">
              <p className="text-sm text-purple-700 mb-1">{der}</p>
              <p className="text-2xl font-bold text-purple-800">{result.der} kcal</p>
              <p className="text-xs text-purple-600 mt-1">{derDesc}</p>
            </div>
          </div>

          {/* 급여 가이드 */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-bold text-gray-700 mb-3">{feedingGuide}</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li className="flex items-start gap-2">
                <span>✅</span>
                <span>권장 급여량은 {result.foodAmount}g이지만, 개체 차이가 있으니 체중 변화를 관찰하세요</span>
              </li>
              <li className="flex items-start gap-2">
                <span>✅</span>
                <span>{feedingGuide2}</span>
              </li>
              <li className="flex items-start gap-2">
                <span>✅</span>
                <span>간식은 1일 칼로리의 10% 이내로 제한하세요 (약 {Math.round(result.der * 0.1)}kcal)</span>
              </li>
              <li className="flex items-start gap-2">
                <span>✅</span>
                <span>{feedingGuide4}</span>
              </li>
            </ul>
          </div>
        </>
      )}

      {/* 이상적인 체중 가이드 */}
      <div className="bg-gray-50 rounded-xl p-4">
        <h3 className="font-bold text-gray-700 mb-3">
          {petType === 'dog' ? dogWeightGuide : catWeightGuide}
        </h3>
        {petType === 'dog' ? (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="py-2 text-left">{sizeHeader}</th>
                <th className="py-2 text-right">{weightRangeHeader}</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-2">{toyDog}</td>
                <td className="py-2 text-right">1.5~4 kg</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2">{smallDog}</td>
                <td className="py-2 text-right">4~10 kg</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2">{mediumDog}</td>
                <td className="py-2 text-right">10~25 kg</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2">{largeDog}</td>
                <td className="py-2 text-right">25~45 kg</td>
              </tr>
              <tr>
                <td className="py-2">{giantDog}</td>
                <td className="py-2 text-right">45kg+</td>
              </tr>
            </tbody>
          </table>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="py-2 text-left">{breedHeader}</th>
                <th className="py-2 text-right">{weightRangeHeader}</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-2">{singapura}</td>
                <td className="py-2 text-right">2~3 kg</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2">{koreanShorthair}</td>
                <td className="py-2 text-right">3~5 kg</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2">{persianSiamese}</td>
                <td className="py-2 text-right">3~6 kg</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2">{britishShorthair}</td>
                <td className="py-2 text-right">4~8 kg</td>
              </tr>
              <tr>
                <td className="py-2">{maineCoon}</td>
                <td className="py-2 text-right">6~11 kg</td>
              </tr>
            </tbody>
          </table>
        )}
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
