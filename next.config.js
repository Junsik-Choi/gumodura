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
  basePath: '/gumodura',
  assetPrefix: '/gumodura/',
};

module.exports = nextConfig;
