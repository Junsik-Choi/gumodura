'use client';

import { useState, useCallback } from 'react';
import ProgressIndicator from '@/components/ProgressIndicator';
import { useTranslatedTexts } from '@/lib/use-translations';

interface ImageFile {
  file: File;
  preview: string;
  id: string;
}

interface Step {
  id: string;
  label: string;
  status: 'pending' | 'in-progress' | 'completed' | 'error';
}

/**
 * 이미지 → PDF 도구
 * 여러 장의 이미지를 하나의 PDF로 합침
 */
export default function ImagesToPdf() {
  const [
    // Step labels
    stepImageCheck,
    stepImageProcess,
    stepPdfCreate,
    stepDownloadReady,
    // Messages
    checkingImages,
    processingImages,
    processingImagesProgress,
    imageLoadFailed,
    creatingPdf,
    downloadReady,
    completed,
    errorOccurred,
    // UI text
    selectImageFiles,
    clickOrDrop,
    supportedFormats,
    selectedImages,
    deleteAll,
    imageLabel,
    pageNumber,
    moveUpLabel,
    moveDownLabel,
    deleteText,
    createPdf,
    sheets,
  ] = useTranslatedTexts([
    // Step labels
    '이미지 확인',
    '이미지 처리',
    'PDF 생성',
    '다운로드 준비',
    // Messages
    '개 이미지 확인 중...',
    '이미지 처리 중...',
    '이미지 처리 중...',
    '이미지 로드 실패',
    'PDF 파일 생성 중...',
    '다운로드 준비 완료!',
    '완료! PDF가 다운로드되었습니다.',
    '오류가 발생했습니다. 다시 시도해주세요.',
    // UI text
    '이미지 파일을 선택하세요',
    '클릭하거나 파일을 끌어다 놓으세요',
    'JPG, PNG, GIF 등 지원 (여러 장 선택 가능)',
    '선택된 이미지',
    '전체 삭제',
    '이미지',
    '번째 페이지',
    '위로',
    '아래로',
    '삭제',
    'PDF 만들기',
    '장',
  ]);

  const [images, setImages] = useState<ImageFile[]>([]);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [message, setMessage] = useState('');
  const [steps, setSteps] = useState<Step[]>([
    { id: 'upload', label: stepImageCheck, status: 'pending' },
    { id: 'process', label: stepImageProcess, status: 'pending' },
    { id: 'create', label: stepPdfCreate, status: 'pending' },
    { id: 'download', label: stepDownloadReady, status: 'pending' },
  ]);

  // 파일 선택 처리
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: ImageFile[] = [];
    
    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          newImages.push({
            file,
            preview: e.target?.result as string,
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          });
          
          if (newImages.length === files.length) {
            setImages(prev => [...prev, ...newImages.filter(img => img.preview)]);
          }
        };
        reader.readAsDataURL(file);
      }
    });
  }, []);

  // 이미지 삭제
  const removeImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  // 이미지 순서 변경 (위로)
  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    setImages(prev => {
      const newImages = [...prev];
      [newImages[index - 1], newImages[index]] = [newImages[index], newImages[index - 1]];
      return newImages;
    });
  };

  // 이미지 순서 변경 (아래로)
  const handleMoveDown = (index: number) => {
    if (index === images.length - 1) return;
    setImages(prev => {
      const newImages = [...prev];
      [newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]];
      return newImages;
    });
  };

  // 단계 상태 업데이트
  const updateStep = (stepIndex: number, status: Step['status']) => {
    setSteps(prev => prev.map((step, i) => ({
      ...step,
      status: i === stepIndex ? status : (i < stepIndex ? 'completed' : step.status),
    })));
    setCurrentStep(stepIndex);
  };

  // PDF 생성
  const generatePdf = async () => {
    if (images.length === 0) return;
    
    setProcessing(true);
    setProgress(0);
    
    try {
      // Step 1: 이미지 확인
      updateStep(0, 'in-progress');
      setMessage(`${images.length}${checkingImages}`);
      await new Promise(r => setTimeout(r, 500));
      setProgress(10);
      updateStep(0, 'completed');

      // Step 2: 이미지 처리
      updateStep(1, 'in-progress');
      setMessage(processingImages);
      
      // jspdf 동적 로드
      const { jsPDF } = await import('jspdf');
      setProgress(20);

      const pdf = new jsPDF();
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // 각 이미지 처리
      for (let i = 0; i < images.length; i++) {
        setMessage(`${processingImagesProgress} (${i + 1}/${images.length})`);
        
        if (i > 0) {
          pdf.addPage();
        }

        const img = new Image();
        img.src = images[i].preview;
        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = () => reject(new Error(imageLoadFailed));
        });

        // 이미지 비율 계산
        const imgWidth = img.width;
        const imgHeight = img.height;
        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
        const width = imgWidth * ratio * 0.9; // 90% 크기로 여백 확보
        const height = imgHeight * ratio * 0.9;
        const x = (pdfWidth - width) / 2;
        const y = (pdfHeight - height) / 2;

        pdf.addImage(images[i].preview, 'JPEG', x, y, width, height);
        
        setProgress(20 + ((i + 1) / images.length) * 50);
      }
      
      updateStep(1, 'completed');

      // Step 3: PDF 생성
      updateStep(2, 'in-progress');
      setMessage(creatingPdf);
      setProgress(80);
      await new Promise(r => setTimeout(r, 500));
      updateStep(2, 'completed');

      // Step 4: 다운로드
      updateStep(3, 'in-progress');
      setMessage(downloadReady);
      setProgress(100);
      
      const filename = `그뭐더라_이미지PDF_${new Date().toISOString().slice(0, 10)}.pdf`;
      pdf.save(filename);
      
      updateStep(3, 'completed');
      setMessage(completed);

    } catch (error) {
      console.error('PDF 생성 오류:', error);
      setMessage(errorOccurred);
      setSteps(prev => prev.map((step, i) => ({
        ...step,
        status: i === currentStep ? 'error' : step.status,
      })));
    } finally {
      setTimeout(() => {
        setProcessing(false);
        setProgress(0);
        setSteps([
          { id: 'upload', label: stepImageCheck, status: 'pending' },
          { id: 'process', label: stepImageProcess, status: 'pending' },
          { id: 'create', label: stepPdfCreate, status: 'pending' },
          { id: 'download', label: stepDownloadReady, status: 'pending' },
        ]);
      }, 3000);
    }
  };

  return (
    <div className="space-y-8">
      {/* 파일 업로드 영역 */}
      {!processing && (
        <>
          <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-ai-primary transition-colors">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              id="file-input"
            />
            <label
              htmlFor="file-input"
              className="cursor-pointer block"
            >
              <div className="text-5xl mb-4">📷</div>
              <p className="text-xl font-semibold text-gray-700 mb-2">
                {selectImageFiles}
              </p>
              <p className="text-gray-500">
                {clickOrDrop}
              </p>
              <p className="text-sm text-gray-400 mt-2">
                {supportedFormats}
              </p>
            </label>
          </div>

          {/* 선택된 이미지 목록 */}
          {images.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-700">
                  {selectedImages} ({images.length}{sheets})
                </h3>
                <button
                  onClick={() => setImages([])}
                  className="text-red-500 hover:text-red-600 font-medium"
                >
                  {deleteAll}
                </button>
              </div>
              
              <div className="space-y-3">
                {images.map((img, index) => (
                  <div
                    key={img.id}
                    className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl"
                  >
                    {/* 썸네일 */}
                    <img
                      src={img.preview}
                      alt={`${imageLabel} ${index + 1}`}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    
                    {/* 순서 번호 + 파일명 */}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800">
                        {index + 1}{pageNumber}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {img.file.name}
                      </p>
                    </div>
                    
                    {/* 순서 변경 버튼 */}
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => handleMoveUp(index)}
                        disabled={index === 0}
                        className="p-1 text-gray-500 hover:text-ai-primary disabled:opacity-30"
                        title={moveUpLabel}
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleMoveDown(index)}
                        disabled={index === images.length - 1}
                        className="p-1 text-gray-500 hover:text-ai-primary disabled:opacity-30"
                        title={moveDownLabel}
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>
                    
                    {/* 삭제 버튼 */}
                    <button
                      onClick={() => removeImage(img.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                      title={deleteText}
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PDF 생성 버튼 */}
          {images.length > 0 && (
            <button
              onClick={generatePdf}
              className="w-full py-4 bg-ai-primary hover:bg-ai-primary-dark text-white font-bold text-xl rounded-2xl transition-colors"
            >
              {createPdf} ({images.length}{sheets})
            </button>
          )}
        </>
      )}

      {/* 진행 상태 */}
      {processing && (
        <ProgressIndicator
          steps={steps}
          currentStep={currentStep}
          progress={progress}
          message={message}
          showDebug={process.env.NODE_ENV === 'development'}
        />
      )}
    </div>
  );
}
