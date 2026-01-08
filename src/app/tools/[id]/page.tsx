import { notFound } from 'next/navigation';
import { getToolById } from '@/lib/registry';
import ImagesToPdf from '@/components/tools/ImagesToPdf';
import QrGenerator from '@/components/tools/QrGenerator';
import ImageResize from '@/components/tools/ImageResize';
import ImageCompress from '@/components/tools/ImageCompress';
import TextCounter from '@/components/tools/TextCounter';
import UnitConverter from '@/components/tools/UnitConverter';
import Timer from '@/components/tools/Timer';
import RandomPicker from '@/components/tools/RandomPicker';
import ComingSoon from '@/components/tools/ComingSoon';

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
      <header className="mb-6 sm:mb-8 text-center">
        <span className="text-4xl sm:text-6xl mb-3 sm:mb-4 block">{tool.icon}</span>
        <h1 className="text-xl sm:text-3xl font-bold text-gray-800 mb-2">
          {tool.name_ko}
        </h1>
        <p className="text-base sm:text-lg text-gray-600">
          {tool.description_ko}
        </p>
        {tool.isPro && (
          <span className="inline-block mt-3 px-3 py-1 bg-yellow-500 text-gray-900 font-semibold text-sm rounded-full">
            PRO 기능
          </span>
        )}
      </header>

      {/* 도구 본체 */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border-2 border-gray-100 p-4 sm:p-8">
        <ToolComponent />
      </div>

      {/* 뒤로가기 */}
      <div className="mt-6 sm:mt-8 text-center">
        <a
          href="/"
          className="inline-flex items-center gap-2 text-ai-primary hover:text-ai-primary-dark font-medium text-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          홈으로 돌아가기
        </a>
      </div>
    </div>
  );
}

// 정적 생성용 (선택사항)
export async function generateStaticParams() {
  const { getAllTools } = await import('@/lib/registry');
  return getAllTools().map(tool => ({ id: tool.id }));
}
