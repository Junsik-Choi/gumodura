/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // GitHub Pages 배포 시 레포지토리 이름으로 설정
  // 커스텀 도메인 사용 시 basePath 제거
  basePath: process.env.NODE_ENV === 'production' ? '/gumodura' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/gumodura/' : '',
};

module.exports = nextConfig;
