'use client';

import { useState, useCallback } from 'react';
import { PDFDocument } from 'pdf-lib';

interface PdfFile {
  id: string;
  file: File;
  name: string;
  pageCount: number;
}

export default function PdfMerge() {
  const [pdfFiles, setPdfFiles] = useState<PdfFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setError(null);
    const newPdfFiles: PdfFile[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type !== 'application/pdf') {
        setError('PDF 파일만 업로드 가능합니다.');
        continue;
      }

      try {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const pageCount = pdf.getPageCount();

        newPdfFiles.push({
          id: `${Date.now()}-${i}`,
          file,
          name: file.name,
          pageCount,
        });
      } catch {
        setError(`${file.name} 파일을 읽을 수 없습니다.`);
      }
    }

    setPdfFiles(prev => [...prev, ...newPdfFiles]);
    e.target.value = '';
  }, []);

  const removeFile = (id: string) => {
    setPdfFiles(prev => prev.filter(f => f.id !== id));
  };

  const moveFile = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= pdfFiles.length) return;

    const newFiles = [...pdfFiles];
    [newFiles[index], newFiles[newIndex]] = [newFiles[newIndex], newFiles[index]];
    setPdfFiles(newFiles);
  };

  const mergePdfs = async () => {
    if (pdfFiles.length < 2) {
      setError('2개 이상의 PDF 파일이 필요합니다.');
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setError(null);

    try {
      const mergedPdf = await PDFDocument.create();

      for (let i = 0; i < pdfFiles.length; i++) {
        const pdfFile = pdfFiles[i];
        const arrayBuffer = await pdfFile.file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        
        pages.forEach(page => {
          mergedPdf.addPage(page);
        });

        setProgress(Math.round(((i + 1) / pdfFiles.length) * 100));
      }

      const mergedPdfBytes = await mergedPdf.save();
      const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `merged_${Date.now()}.pdf`;
      link.click();

      URL.revokeObjectURL(url);
      setProgress(100);
    } catch {
      setError('PDF 합치기 중 오류가 발생했습니다.');
    } finally {
      setIsProcessing(false);
    }
  };

  const totalPages = pdfFiles.reduce((sum, f) => sum + f.pageCount, 0);

  return (
    <div className="space-y-6">
      {/* 파일 업로드 영역 */}
      <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-ai-primary transition-colors">
        <input
          type="file"
          accept=".pdf"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          id="pdf-input"
          disabled={isProcessing}
        />
        <label
          htmlFor="pdf-input"
          className="cursor-pointer block"
        >
          <div className="text-5xl mb-4">📄</div>
          <p className="text-lg font-medium text-gray-700 mb-2">
            PDF 파일을 선택하세요
          </p>
          <p className="text-sm text-gray-500">
            여러 파일을 한 번에 선택하거나, 하나씩 추가할 수 있어요
          </p>
          <button
            type="button"
            className="mt-4 px-6 py-2 bg-ai-primary text-white rounded-xl hover:bg-ai-primary-dark transition-colors"
          >
            파일 선택
          </button>
        </label>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center">
          ⚠️ {error}
        </div>
      )}

      {/* 파일 목록 */}
      {pdfFiles.length > 0 && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-gray-800">
              📚 PDF 파일 목록 ({pdfFiles.length}개, 총 {totalPages}페이지)
            </h3>
            <button
              onClick={() => setPdfFiles([])}
              className="text-sm text-gray-500 hover:text-red-500"
            >
              전체 삭제
            </button>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 space-y-2">
            {pdfFiles.map((pdfFile, index) => (
              <div
                key={pdfFile.id}
                className="flex items-center gap-3 bg-white rounded-lg p-3 border border-gray-200"
              >
                <span className="text-gray-400 font-mono text-sm w-6">
                  {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 truncate">
                    {pdfFile.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {pdfFile.pageCount}페이지
                  </p>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => moveFile(index, 'up')}
                    disabled={index === 0 || isProcessing}
                    className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-30"
                    title="위로"
                  >
                    ⬆️
                  </button>
                  <button
                    onClick={() => moveFile(index, 'down')}
                    disabled={index === pdfFiles.length - 1 || isProcessing}
                    className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-30"
                    title="아래로"
                  >
                    ⬇️
                  </button>
                  <button
                    onClick={() => removeFile(pdfFile.id)}
                    disabled={isProcessing}
                    className="p-2 hover:bg-red-100 rounded-lg text-red-500"
                    title="삭제"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>

          <p className="text-sm text-gray-500 text-center">
            💡 위/아래 버튼으로 순서를 변경할 수 있어요
          </p>
        </div>
      )}

      {/* 진행 상황 */}
      {isProcessing && (
        <div className="bg-blue-50 rounded-xl p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium text-blue-700">PDF 합치는 중...</span>
            <span className="text-blue-600">{progress}%</span>
          </div>
          <div className="h-3 bg-blue-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* 합치기 버튼 */}
      {pdfFiles.length >= 2 && !isProcessing && (
        <button
          onClick={mergePdfs}
          className="w-full py-4 bg-gradient-to-r from-ai-primary to-purple-600 text-white font-bold text-lg rounded-xl hover:opacity-90 transition-opacity"
        >
          🔗 PDF 합치기 ({pdfFiles.length}개 → 1개)
        </button>
      )}

      {/* 안내 */}
      <div className="bg-gray-50 rounded-xl p-4">
        <h3 className="font-bold text-gray-700 mb-2">💡 사용 안내</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• 여러 개의 PDF 파일을 하나로 합칠 수 있어요</li>
          <li>• 파일 순서는 드래그하거나 화살표로 변경 가능해요</li>
          <li>• 모든 처리는 브라우저에서 진행되어 파일이 서버로 전송되지 않아요</li>
          <li>• 최대 파일 크기 제한이 없지만, 큰 파일은 시간이 걸릴 수 있어요</li>
        </ul>
      </div>
    </div>
  );
}
