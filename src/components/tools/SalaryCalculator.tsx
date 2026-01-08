'use client';

import { useState, useMemo } from 'react';
import { useTranslatedTexts } from '@/lib/use-translations';

// 2026년 기준 4대보험 요율
const RATES_2026 = {
  nationalPension: 0.045,        // 국민연금 4.5%
  healthInsurance: 0.0389,       // 건강보험 3.89%
  longTermCare: 0.1295,          // 장기요양보험 (건강보험의 12.95%)
  employmentInsurance: 0.009,    // 고용보험 0.9%
};

// 국민연금 상한액/하한액 (2026년 예상 기준)
const PENSION_LIMITS = {
  min: 370000,    // 하한액 월 37만원
  max: 6170000,   // 상한액 월 617만원
};

// 소득세 세율 (2026년 기준)
const INCOME_TAX_BRACKETS = [
  { limit: 14000000, rate: 0.06, deduction: 0 },
  { limit: 50000000, rate: 0.15, deduction: 1260000 },
  { limit: 88000000, rate: 0.24, deduction: 5760000 },
  { limit: 150000000, rate: 0.35, deduction: 15440000 },
  { limit: 300000000, rate: 0.38, deduction: 19940000 },
  { limit: 500000000, rate: 0.40, deduction: 25940000 },
  { limit: 1000000000, rate: 0.42, deduction: 35940000 },
  { limit: Infinity, rate: 0.45, deduction: 65940000 },
];

interface DeductionResult {
  nationalPension: number;
  healthInsurance: number;
  longTermCare: number;
  employmentInsurance: number;
  incomeTax: number;
  localIncomeTax: number;
  totalDeduction: number;
  netSalary: number;
}

function calculateDeductions(annualSalary: number, dependents: number = 1, children: number = 0): DeductionResult {
  const monthlySalary = annualSalary / 12;
  
  // 국민연금 (상한/하한 적용)
  const pensionBase = Math.max(PENSION_LIMITS.min, Math.min(PENSION_LIMITS.max, monthlySalary));
  const nationalPension = Math.floor(pensionBase * RATES_2026.nationalPension);
  
  // 건강보험
  const healthInsurance = Math.floor(monthlySalary * RATES_2026.healthInsurance);
  
  // 장기요양보험 (건강보험료의 12.95%)
  const longTermCare = Math.floor(healthInsurance * RATES_2026.longTermCare);
  
  // 고용보험
  const employmentInsurance = Math.floor(monthlySalary * RATES_2026.employmentInsurance);
  
  // 소득세 (간이세액표 기준 근사)
  // 연간 과세표준 계산 (근로소득공제 적용)
  let taxableIncome = annualSalary;
  
  // 근로소득공제
  if (annualSalary <= 5000000) {
    taxableIncome -= annualSalary * 0.7;
  } else if (annualSalary <= 15000000) {
    taxableIncome -= 3500000 + (annualSalary - 5000000) * 0.4;
  } else if (annualSalary <= 45000000) {
    taxableIncome -= 7500000 + (annualSalary - 15000000) * 0.15;
  } else if (annualSalary <= 100000000) {
    taxableIncome -= 12000000 + (annualSalary - 45000000) * 0.05;
  } else {
    taxableIncome -= 14750000 + (annualSalary - 100000000) * 0.02;
  }
  
  // 인적공제 (본인 150만원 + 부양가족)
  const personalDeduction = 1500000 * dependents;
  
  // 자녀세액공제용
  const childDeduction = children * 1500000;
  
  taxableIncome = Math.max(0, taxableIncome - personalDeduction - childDeduction);
  
  // 산출세액 계산
  let annualIncomeTax = 0;
  for (const bracket of INCOME_TAX_BRACKETS) {
    if (taxableIncome <= bracket.limit) {
      annualIncomeTax = taxableIncome * bracket.rate - bracket.deduction;
      break;
    }
  }
  
  // 자녀세액공제
  if (children >= 1) {
    annualIncomeTax -= 150000 * Math.min(children, 2);
    if (children > 2) {
      annualIncomeTax -= 300000 * (children - 2);
    }
  }
  
  annualIncomeTax = Math.max(0, annualIncomeTax);
  const incomeTax = Math.floor(annualIncomeTax / 12);
  
  // 지방소득세 (소득세의 10%)
  const localIncomeTax = Math.floor(incomeTax * 0.1);
  
  // 총 공제액
  const totalDeduction = nationalPension + healthInsurance + longTermCare + employmentInsurance + incomeTax + localIncomeTax;
  
  // 실수령액
  const netSalary = Math.floor(monthlySalary - totalDeduction);
  
  return {
    nationalPension,
    healthInsurance,
    longTermCare,
    employmentInsurance,
    incomeTax,
    localIncomeTax,
    totalDeduction,
    netSalary,
  };
}

// 금액 포맷팅
function formatMoney(amount: number): string {
  return amount.toLocaleString('ko-KR');
}

export default function SalaryCalculator() {
  const [
    annualSalaryLabel,
    enterSalaryPlaceholder,
    wonText,
    preset30m,
    preset40m,
    preset50m,
    preset60m,
    preset70m,
    preset100m,
    dependentsLabel,
    personText,
    childrenLabel,
    monthlyNetSalary,
    annualNetSalary,
    monthlyDeductionDetails,
    fourInsuranceTitle,
    nationalPensionLabel,
    healthInsuranceLabel,
    longTermCareLabel,
    employmentInsuranceLabel,
    fourInsuranceSubtotal,
    taxTitle,
    incomeTaxLabel,
    localIncomeTaxLabel,
    taxSubtotal,
    monthlySalaryLabel,
    beforeTaxLabel,
    totalDeductionLabel,
    netSalaryLabel,
    salaryComparisonTitle,
    salaryColumnLabel,
    monthlyNetColumnLabel,
    deductionRateLabel,
    tenMillionText,
    hundredMillionText,
    notesTitle,
    note1,
    note2,
    note3,
    note4,
  ] = useTranslatedTexts([
    '💰 연봉 (세전)',
    '연봉을 입력하세요',
    '원',
    '3,000만원',
    '4,000만원',
    '5,000만원',
    '6,000만원',
    '7,000만원',
    '1억원',
    '👨‍👩‍👧 부양가족 수 (본인 포함)',
    '명',
    '👶 20세 이하 자녀 수',
    '월 실수령액',
    '연간 실수령액',
    '📋 월별 공제 내역',
    '🏥 4대보험',
    '국민연금 (4.5%)',
    '건강보험 (3.89%)',
    '장기요양 (12.95%)',
    '고용보험 (0.9%)',
    '4대보험 소계',
    '💸 세금',
    '소득세 (간이세액)',
    '지방소득세 (10%)',
    '세금 소계',
    '월 급여',
    '(세전)',
    '총 공제액',
    '실수령액',
    '📊 연봉별 실수령액 비교',
    '연봉',
    '월 실수령',
    '공제율',
    '천만',
    '억',
    '⚠️ 참고사항',
    '2026년 예상 4대보험 요율 기준 계산입니다.',
    '실제 공제액은 회사, 상여금 지급 방식 등에 따라 다를 수 있습니다.',
    '소득세는 간이세액표 기준 근사치이며, 연말정산 시 차이가 발생할 수 있습니다.',
    '비과세 항목(식대, 교통비 등)은 포함되지 않았습니다.',
  ]);

  const [annualSalary, setAnnualSalary] = useState<string>('50000000');
  const [dependents, setDependents] = useState<number>(1);
  const [children, setChildren] = useState<number>(0);

  const salary = parseInt(annualSalary.replace(/,/g, '')) || 0;
  const result = useMemo(() => calculateDeductions(salary, dependents, children), [salary, dependents, children]);
  
  const handleSalaryChange = (value: string) => {
    // 숫자만 추출
    const numericValue = value.replace(/[^0-9]/g, '');
    setAnnualSalary(numericValue);
  };

  // 빠른 선택 프리셋
  const salaryPresets = [
    { label: preset30m, value: 30000000 },
    { label: preset40m, value: 40000000 },
    { label: preset50m, value: 50000000 },
    { label: preset60m, value: 60000000 },
    { label: preset70m, value: 70000000 },
    { label: preset100m, value: 100000000 },
  ];

  return (
    <div className="space-y-6">
      {/* 입력 섹션 */}
      <div className="space-y-4">
        <div>
          <label className="block font-semibold text-gray-700 mb-2">{annualSalaryLabel}</label>
          <div className="relative">
            <input
              type="text"
              value={formatMoney(parseInt(annualSalary) || 0)}
              onChange={(e) => handleSalaryChange(e.target.value)}
              className="w-full p-4 text-2xl font-bold text-center border-2 border-gray-200 rounded-xl focus:border-ai-primary focus:outline-none"
              placeholder={enterSalaryPlaceholder}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg">{wonText}</span>
          </div>
        </div>

        {/* 빠른 선택 */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {salaryPresets.map((preset) => (
            <button
              key={preset.value}
              onClick={() => setAnnualSalary(preset.value.toString())}
              className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                parseInt(annualSalary) === preset.value
                  ? 'bg-ai-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* 부양가족 & 자녀 */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium text-gray-700 mb-2">{dependentsLabel}</label>
            <select
              value={dependents}
              onChange={(e) => setDependents(parseInt(e.target.value))}
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-ai-primary focus:outline-none"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <option key={num} value={num}>{num}{personText}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-medium text-gray-700 mb-2">{childrenLabel}</label>
            <select
              value={children}
              onChange={(e) => setChildren(parseInt(e.target.value))}
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-ai-primary focus:outline-none"
            >
              {[0, 1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>{num}{personText}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 결과 - 하이라이트 */}
      <div className="bg-gradient-to-br from-ai-primary to-purple-600 rounded-2xl p-6 text-white text-center">
        <p className="text-lg opacity-90 mb-2">{monthlyNetSalary}</p>
        <p className="text-4xl sm:text-5xl font-bold">
          {formatMoney(result.netSalary)}{wonText}
        </p>
        <p className="text-sm opacity-80 mt-3">
          {annualNetSalary}: {formatMoney(result.netSalary * 12)}{wonText}
        </p>
      </div>

      {/* 공제 내역 */}
      <div className="bg-gray-50 rounded-2xl p-5">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          {monthlyDeductionDetails}
        </h3>
        <div className="space-y-3">
          {/* 4대보험 */}
          <div className="bg-white rounded-xl p-4">
            <p className="font-medium text-gray-700 mb-3">{fourInsuranceTitle}</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">{nationalPensionLabel}</span>
                <span className="font-medium">-{formatMoney(result.nationalPension)}{wonText}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{healthInsuranceLabel}</span>
                <span className="font-medium">-{formatMoney(result.healthInsurance)}{wonText}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{longTermCareLabel}</span>
                <span className="font-medium">-{formatMoney(result.longTermCare)}{wonText}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{employmentInsuranceLabel}</span>
                <span className="font-medium">-{formatMoney(result.employmentInsurance)}{wonText}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-100">
                <span className="font-medium text-gray-700">{fourInsuranceSubtotal}</span>
                <span className="font-bold text-blue-600">
                  -{formatMoney(result.nationalPension + result.healthInsurance + result.longTermCare + result.employmentInsurance)}{wonText}
                </span>
              </div>
            </div>
          </div>

          {/* 세금 */}
          <div className="bg-white rounded-xl p-4">
            <p className="font-medium text-gray-700 mb-3">{taxTitle}</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">{incomeTaxLabel}</span>
                <span className="font-medium">-{formatMoney(result.incomeTax)}{wonText}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{localIncomeTaxLabel}</span>
                <span className="font-medium">-{formatMoney(result.localIncomeTax)}{wonText}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-100">
                <span className="font-medium text-gray-700">{taxSubtotal}</span>
                <span className="font-bold text-red-600">
                  -{formatMoney(result.incomeTax + result.localIncomeTax)}{wonText}
                </span>
              </div>
            </div>
          </div>

          {/* 총계 */}
          <div className="bg-white rounded-xl p-4 border-2 border-ai-primary/30">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-700">{monthlySalaryLabel}</p>
                <p className="text-sm text-gray-500">{beforeTaxLabel}</p>
              </div>
              <span className="text-xl font-bold">{formatMoney(Math.floor(salary / 12))}{wonText}</span>
            </div>
            <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
              <div>
                <p className="font-medium text-gray-700">{totalDeductionLabel}</p>
              </div>
              <span className="text-xl font-bold text-red-500">-{formatMoney(result.totalDeduction)}{wonText}</span>
            </div>
            <div className="flex justify-between items-center mt-3 pt-3 border-t-2 border-ai-primary">
              <div>
                <p className="font-bold text-gray-800">{netSalaryLabel}</p>
              </div>
              <span className="text-2xl font-bold text-ai-primary">{formatMoney(result.netSalary)}{wonText}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 연봉별 비교표 */}
      <div className="bg-gray-50 rounded-2xl p-5">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          {salaryComparisonTitle}
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="py-2 px-3 text-left">{salaryColumnLabel}</th>
                <th className="py-2 px-3 text-right">{monthlyNetColumnLabel}</th>
                <th className="py-2 px-3 text-right">{deductionRateLabel}</th>
              </tr>
            </thead>
            <tbody>
              {[3000, 4000, 5000, 6000, 7000, 8000, 10000].map((sal) => {
                const res = calculateDeductions(sal * 10000, dependents, children);
                const monthlyGross = (sal * 10000) / 12;
                const deductionRate = ((res.totalDeduction / monthlyGross) * 100).toFixed(1);
                const isCurrentRange = salary >= (sal - 500) * 10000 && salary < (sal + 500) * 10000;
                
                return (
                  <tr 
                    key={sal} 
                    className={`border-b border-gray-100 ${isCurrentRange ? 'bg-ai-primary/10' : ''}`}
                  >
                    <td className="py-2 px-3 font-medium">{sal >= 10000 ? `${sal / 10000}${hundredMillionText}` : `${sal / 100}${tenMillionText}`}{wonText}</td>
                    <td className="py-2 px-3 text-right font-bold">{formatMoney(res.netSalary)}{wonText}</td>
                    <td className="py-2 px-3 text-right text-gray-500">{deductionRate}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 안내 */}
      <div className="bg-yellow-50 rounded-xl p-4 text-sm text-yellow-800">
        <p className="font-medium mb-2">{notesTitle}</p>
        <ul className="list-disc list-inside space-y-1 text-yellow-700">
          <li>{note1}</li>
          <li>{note2}</li>
          <li>{note3}</li>
          <li>{note4}</li>
        </ul>
      </div>
    </div>
  );
}
