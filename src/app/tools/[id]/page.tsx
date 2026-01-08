import { notFound } from 'next/navigation';
import { getToolById } from '@/lib/registry';
import ToolPageHeader from '@/components/ToolPageHeader';
import ToolPageFooter from '@/components/ToolPageFooter';
import ImagesToPdf from '@/components/tools/ImagesToPdf';
import QrGenerator from '@/components/tools/QrGenerator';
import ImageResize from '@/components/tools/ImageResize';
import ImageCompress from '@/components/tools/ImageCompress';
import TextCounter from '@/components/tools/TextCounter';
import UnitConverter from '@/components/tools/UnitConverter';
import Timer from '@/components/tools/Timer';
import RandomPicker from '@/components/tools/RandomPicker';
import ComingSoon from '@/components/tools/ComingSoon';
// 금융 계산기
import SalaryCalculator from '@/components/tools/SalaryCalculator';
import StockAverageCalculator from '@/components/tools/StockAverageCalculator';
import VatCalculator from '@/components/tools/VatCalculator';
import PercentCalculator from '@/components/tools/PercentCalculator';
// PDF/파일 도구
import PdfMerge from '@/components/tools/PdfMerge';
// 생활/편의 도구
import LunarSolarConverter from '@/components/tools/LunarSolarConverter';
import MilitaryDischargeCalculator from '@/components/tools/MilitaryDischargeCalculator';
import AgeCalculator from '@/components/tools/AgeCalculator';
import MyIpAddress from '@/components/tools/MyIpAddress';
import PostcodeSearch from '@/components/tools/PostcodeSearch';
// 이미지/미디어 도구
import BackgroundRemover from '@/components/tools/BackgroundRemover';
import YoutubeThumbnail from '@/components/tools/YoutubeThumbnail';
// 건강/반려동물 도구
import BmiCalculator from '@/components/tools/BmiCalculator';
import PetCalorieCalculator from '@/components/tools/PetCalorieCalculator';
// 재미/놀이 도구
import LunchMenuPicker from '@/components/tools/LunchMenuPicker';
import LadderGame from '@/components/tools/LadderGame';

interface ToolPageProps {
  params: Promise<{ id: string }>;
}

/**
 * 도구 동적 페이지
 * /tools/[id] 형태로 모든 도구를 처리
 * 
 * 새 도구 추가 시:
 * 1. registry에 도구 등록
 * 2. 여기 toolComponents에 컴포넌트 매핑 추가
 * 3. /components/tools/에 실제 컴포넌트 구현
 */

// 도구 ID별 컴포넌트 매핑
const toolComponents: Record<string, React.ComponentType> = {
  'images-to-pdf': ImagesToPdf,
  'qr-generator': QrGenerator,
  'image-resize': ImageResize,
  'image-compress': ImageCompress,
  'text-counter': TextCounter,
  'unit-converter': UnitConverter,
  'timer': Timer,
  'random-picker': RandomPicker,
  // 금융 계산기
  'salary-calculator': SalaryCalculator,
  'stock-average': StockAverageCalculator,
  'vat-calculator': VatCalculator,
  'percent-calculator': PercentCalculator,
  // PDF/파일 도구
  'pdf-merge': PdfMerge,
  // 생활/편의 도구
  'lunar-solar': LunarSolarConverter,
  'military-discharge': MilitaryDischargeCalculator,
  'age-calculator': AgeCalculator,
  'my-ip': MyIpAddress,
  'postcode': PostcodeSearch,
  // 이미지/미디어 도구
  'background-remover': BackgroundRemover,
  'youtube-thumbnail': YoutubeThumbnail,
  // 건강/반려동물 도구
  'bmi-calculator': BmiCalculator,
  'pet-calorie': PetCalorieCalculator,
  // 재미/놀이 도구
  'lunch-menu': LunchMenuPicker,
  'ladder-game': LadderGame,
  // 새 도구 추가 시 여기에 매핑
};

export default async function ToolPage({ params }: ToolPageProps) {
  const { id } = await params;
  const tool = getToolById(id);

  if (!tool) {
    notFound();
  }

  // 해당 도구의 컴포넌트 가져오기
  const ToolComponent = toolComponents[id] || ComingSoon;

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
      {/* 도구 헤더 */}
      <ToolPageHeader tool={tool} />

      {/* 도구 본체 */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border-2 border-gray-100 p-4 sm:p-8">
        <ToolComponent />
      </div>

      {/* 뒤로가기 */}
      <ToolPageFooter />
    </div>
  );
}

// 정적 생성용 (선택사항)
export async function generateStaticParams() {
  const { getAllTools } = await import('@/lib/registry');
  return getAllTools().map(tool => ({ id: tool.id }));
}
