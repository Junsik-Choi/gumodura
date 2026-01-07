/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // AI 검색 포인트 컬러 - 세련된 바이올렛
        'ai-primary': '#7C3AED',
        'ai-primary-light': '#A78BFA',
        'ai-primary-dark': '#5B21B6',
        // 브랜드 컬러
        'brand': {
          50: '#F5F3FF',
          100: '#EDE9FE',
          200: '#DDD6FE',
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#7C3AED',
          700: '#6D28D9',
          800: '#5B21B6',
          900: '#4C1D95',
        }
      },
      fontSize: {
        // 어르신용 큰 폰트
        'elder-sm': '1rem',
        'elder-base': '1.125rem',
        'elder-lg': '1.25rem',
        'elder-xl': '1.5rem',
        'elder-2xl': '1.875rem',
        'elder-3xl': '2.25rem',
      },
      spacing: {
        // 터치 친화적 간격
        'touch': '44px',
      }
    },
  },
  plugins: [],
}
