import type { Metadata, Viewport } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import './globals.css';

export const metadata: Metadata = {
  title: '그 뭐더라 - 생활 도구 종합',
  description: '어르신도 쓰기 쉬운 생활, 파일, 놀이 도구 종합 웹사이트. 필요한 기능을 AI에게 물어보세요!',
  keywords: ['생활도구', '파일변환', 'PDF', 'QR코드', '이미지편집', '무료도구'],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: '그 뭐더라',
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
  themeColor: '#7C3AED',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-14 sm:pt-20">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
