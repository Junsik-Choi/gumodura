import { Tool } from './types';

/**
 * 도구 레지스트리 (핵심!)
 * 
 * 새 기능 추가 시:
 * 1. 이 배열에 도구 정보 추가
 * 2. /src/app/tools/[id]/page.tsx에서 렌더링됨
 * 3. 개별 도구 컴포넌트는 /src/components/tools/에 생성
 */
export const TOOLS_REGISTRY: Tool[] = [
  // ============ 파일 도구 ============
  {
    id: 'images-to-pdf',
    name_ko: '이미지 → PDF 만들기',
    name_en: 'Images to PDF',
    name_ja: '画像をPDFに変換',
    name_zh: '图片转PDF',
    name_es: 'Imágenes a PDF',
    description_ko: '여러 장의 이미지를 하나의 PDF 파일로 합쳐요',
    description_en: 'Combine multiple images into a single PDF file',
    category: 'file',
    keywords: [
      '이미지', '사진', 'PDF', '피디에프', '합치기', '변환',
      '여러장', '묶기', '문서', '스캔', 'jpg', 'png', 'jpeg',
      '사진 PDF', '이미지 합치기', '사진 합치기', '이미지 변환'
    ],
    route: '/tools/images-to-pdf/',
    icon: '📄',
    isNew: true,
    isPopular: true,
  },
  
  // ============ QR/바코드 도구 ============
  {
    id: 'qr-generator',
    name_ko: '예쁜 QR 코드 만들기',
    name_en: 'Create Pretty QR Code',
    name_ja: 'QRコード作成',
    name_zh: '创建QR码',
    name_es: 'Crear código QR',
    description_ko: '다양한 스타일의 QR 코드를 만들어요',
    description_en: 'Create QR codes in various styles',
    category: 'qr',
    keywords: [
      'QR', 'QR코드', '큐알', '큐알코드', '생성', '만들기',
      '예쁜', '디자인', '링크', 'URL', '바코드', '명함',
      'QR 생성', 'QR 만들기', '큐알 만들기'
    ],
    route: '/tools/qr-generator/',
    icon: '📲',
    isNew: true,
    isPopular: true,
  },

  // ============ 이미지 도구 ============
  {
    id: 'image-resize',
    name_ko: '이미지 크기 조절',
    name_en: 'Image Resize',
    name_ja: '画像サイズ変更',
    name_zh: '调整图片大小',
    name_es: 'Cambiar tamaño de imagen',
    description_ko: '이미지 크기를 원하는 대로 바꿔요',
    description_en: 'Resize images to your desired dimensions',
    category: 'image',
    keywords: [
      '이미지', '사진', '크기', '조절', '리사이즈', 'resize',
      '줄이기', '키우기', '변경', '픽셀', '확대', '축소'
    ],
    route: '/tools/image-resize/',
    icon: '🔍',
  },

  {
    id: 'image-compress',
    name_ko: '이미지 용량 줄이기',
    name_en: 'Image Compress',
    name_ja: '画像圧縮',
    name_zh: '压缩图片',
    name_es: 'Comprimir imagen',
    description_ko: '이미지 파일 용량을 줄여요',
    description_en: 'Reduce image file size',
    category: 'image',
    keywords: [
      '이미지', '사진', '용량', '줄이기', '압축', '최적화',
      '가볍게', '파일 크기', 'compress', 'MB', 'KB'
    ],
    route: '/tools/image-compress/',
    icon: '📉',
  },

  // ============ 텍스트 도구 ============
  {
    id: 'text-counter',
    name_ko: '글자 수 세기',
    name_en: 'Character Counter',
    name_ja: '文字数カウント',
    name_zh: '字数统计',
    name_es: 'Contador de caracteres',
    description_ko: '글자, 단어, 문장 수를 세어요',
    description_en: 'Count characters, words, and sentences',
    category: 'text',
    keywords: [
      '글자', '문자', '단어', '수', '세기', '카운트', 'count',
      '글자수', '문자수', '띄어쓰기', '공백'
    ],
    route: '/tools/text-counter/',
    icon: '🔢',
  },

  // ============ 계산/변환 도구 ============
  {
    id: 'unit-converter',
    name_ko: '단위 변환기',
    name_en: 'Unit Converter',
    name_ja: '単位変換',
    name_zh: '单位转换',
    name_es: 'Conversor de unidades',
    description_ko: '길이, 무게, 온도 등 단위를 변환해요',
    description_en: 'Convert length, weight, temperature and more',
    category: 'calc',
    keywords: [
      '단위', '변환', 'cm', 'inch', 'kg', 'lb', '섭씨', '화씨',
      '길이', '무게', '온도', '미터', '킬로', '파운드'
    ],
    route: '/tools/unit-converter/',
    icon: '⚖️',
  },

  // ============ 생활 도구 ============
  {
    id: 'timer',
    name_ko: '타이머',
    name_en: 'Timer',
    name_ja: 'タイマー',
    name_zh: '计时器',
    name_es: 'Temporizador',
    description_ko: '시간을 설정하고 알림 받아요',
    description_en: 'Set a timer and get notified',
    category: 'life',
    keywords: [
      '타이머', '시간', '알람', '알림', 'timer', '초시계',
      '분', '초', '카운트다운', '요리'
    ],
    route: '/tools/timer/',
    icon: '⏱️',
  },

  // ============ 재미/놀이 도구 ============
  {
    id: 'random-picker',
    name_ko: '랜덤 뽑기',
    name_en: 'Random Picker',
    name_ja: 'ランダム抽選',
    name_zh: '随机抽选',
    name_es: 'Selector aleatorio',
    description_ko: '목록에서 무작위로 하나를 뽑아요',
    description_en: 'Randomly pick one from a list',
    category: 'fun',
    keywords: [
      '랜덤', '무작위', '뽑기', '추첨', '제비뽑기', 'random',
      '선택', '고르기', '룰렛', '당첨'
    ],
    route: '/tools/random-picker/',
    icon: '🎲',
  },

  // ============ 금융 계산기 ============
  {
    id: 'salary-calculator',
    name_ko: '연봉 실수령액 계산기',
    name_en: 'Salary Calculator',
    name_ja: '給与計算機',
    name_zh: '工资计算器',
    name_es: 'Calculadora de salario',
    description_ko: '4대보험 공제 후 월 실수령액을 계산해요',
    description_en: 'Calculate take-home pay after deductions',
    category: 'finance',
    keywords: [
      '연봉', '실수령액', '월급', '세금', '4대보험', '국민연금',
      '건강보험', '고용보험', '소득세', '급여', '세후', '연봉계산기',
      '월급계산', '실수령', '세전세후'
    ],
    route: '/tools/salary-calculator/',
    icon: '💰',
    isNew: true,
    isPopular: true,
  },
  {
    id: 'stock-average',
    name_ko: '주식 물타기 계산기',
    name_en: 'Stock Average Calculator',
    name_ja: '株式平均計算機',
    name_zh: '股票均价计算',
    name_es: 'Calculadora promedio de acciones',
    description_ko: '평균 매수 단가를 계산해요',
    description_en: 'Calculate average stock purchase price',
    category: 'finance',
    keywords: [
      '주식', '물타기', '평균단가', '평단가', '매수', '주식계산기',
      '평균매수가', '물타기계산', '주식평균', '추가매수', '분할매수'
    ],
    route: '/tools/stock-average/',
    icon: '📈',
    isNew: true,
  },
  {
    id: 'vat-calculator',
    name_ko: '부가세 계산기',
    name_en: 'VAT Calculator',
    name_ja: '消費税計算機',
    name_zh: '增值税计算器',
    name_es: 'Calculadora de IVA',
    description_ko: '공급가액과 부가세를 분리 계산해요',
    description_en: 'Calculate VAT and supply amount',
    category: 'finance',
    keywords: [
      '부가세', '부가가치세', 'VAT', '공급가액', '세금', '세금계산서',
      '10%', '부가세계산', '세액', '합계금액', '역산'
    ],
    route: '/tools/vat-calculator/',
    icon: '🧾',
    isNew: true,
  },
  {
    id: 'percent-calculator',
    name_ko: '퍼센트 계산기',
    name_en: 'Percent Calculator',
    name_ja: 'パーセント計算機',
    name_zh: '百分比计算器',
    name_es: 'Calculadora de porcentaje',
    description_ko: '다양한 퍼센트 계산을 해요',
    description_en: 'Various percentage calculations',
    category: 'finance',
    keywords: [
      '퍼센트', '비율', '%', '할인', '증가율', '변화율',
      '퍼센트계산', '비율계산', '할인계산', '백분율'
    ],
    route: '/tools/percent-calculator/',
    icon: '📊',
    isNew: true,
  },

  // ============ PDF/파일 도구 ============
  {
    id: 'pdf-merge',
    name_ko: 'PDF 합치기',
    name_en: 'Merge PDFs',
    name_ja: 'PDF結合',
    name_zh: '合并PDF',
    name_es: 'Combinar PDF',
    description_ko: '여러 개의 PDF 파일을 하나로 합쳐요',
    description_en: 'Combine multiple PDF files into one',
    category: 'file',
    keywords: [
      'PDF', '합치기', '병합', '결합', '피디에프', '파일합치기',
      'PDF병합', 'PDF결합', '문서합치기', 'merge', 'combine'
    ],
    route: '/tools/pdf-merge/',
    icon: '📑',
    isNew: true,
  },

  // ============ 생활/편의 도구 ============
  {
    id: 'lunar-solar',
    name_ko: '음력/양력 변환기',
    name_en: 'Lunar/Solar Converter',
    name_ja: '旧暦/新暦変換',
    name_zh: '农历/阳历转换',
    name_es: 'Conversión lunar/solar',
    description_ko: '음력과 양력 날짜를 변환하고 간지를 확인해요',
    description_en: 'Convert between lunar and solar calendar dates',
    category: 'life',
    keywords: [
      '음력', '양력', '변환', '달력', '간지', '띠', '생일',
      '음력양력변환', '양력음력변환', '음력날짜', '양력날짜', '갑자'
    ],
    route: '/tools/lunar-solar/',
    icon: '🌙',
    isNew: true,
  },
  {
    id: 'military-discharge',
    name_ko: '전역일 계산기',
    name_en: 'Military Discharge Calculator',
    name_ja: '除隊日計算機',
    name_zh: '退伍日计算器',
    name_es: 'Calculadora de licencia militar',
    description_ko: '군 전역일과 복무 진행률을 계산해요',
    description_en: 'Calculate military discharge date and progress',
    category: 'life',
    keywords: [
      '전역일', '군대', '복무', '병역', '군복무', '전역',
      '입대', '진급', '일병', '상병', '병장', '전역일계산기',
      'D-day', '군전역', '복무기간'
    ],
    route: '/tools/military-discharge/',
    icon: '🎖️',
    isNew: true,
    isPopular: true,
  },
  {
    id: 'age-calculator',
    name_ko: '만 나이 계산기',
    name_en: 'Age Calculator',
    name_ja: '年齢計算機',
    name_zh: '年龄计算器',
    name_es: 'Calculadora de edad',
    description_ko: '만 나이와 한국식 나이를 계산해요',
    description_en: 'Calculate international age and Korean age',
    category: 'life',
    keywords: [
      '만나이', '나이', '세', '생일', '나이계산', '만나이계산',
      '한국나이', '연나이', '생후일수', '별자리', '띠'
    ],
    route: '/tools/age-calculator/',
    icon: '🎂',
    isNew: true,
  },
  {
    id: 'my-ip',
    name_ko: '내 아이피 확인',
    name_en: 'My IP Address',
    name_ja: 'IPアドレス確認',
    name_zh: '查看IP地址',
    name_es: 'Mi dirección IP',
    description_ko: '현재 접속한 공인 IP 주소를 확인해요',
    description_en: 'Check your public IP address',
    category: 'life',
    keywords: [
      'IP', '아이피', '공인IP', 'IP주소', '내아이피', 'myip',
      '아이피확인', 'IP확인', '인터넷주소', '네트워크'
    ],
    route: '/tools/my-ip/',
    icon: '🌐',
    isNew: true,
  },
  {
    id: 'postcode',
    name_ko: '우편번호 찾기',
    name_en: 'Postal Code Finder',
    name_ja: '郵便番号検索',
    name_zh: '邮编查询',
    name_es: 'Buscador de código postal',
    description_ko: '주소 검색으로 우편번호를 찾아요',
    description_en: 'Find postal codes by address search',
    category: 'life',
    keywords: [
      '우편번호', '주소', '도로명주소', '지번주소', '우편번호찾기',
      '주소검색', '우체국', '배송지', '주소찾기'
    ],
    route: '/tools/postcode/',
    icon: '📮',
    isNew: true,
  },

  // ============ 이미지/미디어 도구 ============
  {
    id: 'background-remover',
    name_ko: '이미지 배경 제거',
    name_en: 'Background Remover',
    name_ja: '背景削除',
    name_zh: '去除背景',
    name_es: 'Eliminar fondo',
    description_ko: '이미지에서 배경을 자동으로 제거해요',
    description_en: 'Automatically remove image backgrounds',
    category: 'image',
    keywords: [
      '배경제거', '배경', '누끼', '투명배경', '포토샵',
      '배경지우기', '배경삭제', '이미지편집', '누끼따기'
    ],
    route: '/tools/background-remover/',
    icon: '✂️',
    isNew: true,
  },
  {
    id: 'youtube-thumbnail',
    name_ko: '유튜브 썸네일 다운로드',
    name_en: 'YouTube Thumbnail Download',
    name_ja: 'YouTube サムネイルダウンロード',
    name_zh: 'YouTube缩略图下载',
    name_es: 'Descargar miniatura de YouTube',
    description_ko: 'YouTube 영상의 썸네일 이미지를 다운로드해요',
    description_en: 'Download thumbnail images from YouTube videos',
    category: 'image',
    keywords: [
      '유튜브', '썸네일', 'YouTube', '유튜브썸네일', '썸네일추출',
      '썸네일다운로드', '영상썸네일', '유튜브이미지', '섬네일'
    ],
    route: '/tools/youtube-thumbnail/',
    icon: '🎬',
    isNew: true,
    isPopular: true,
  },

  // ============ 건강/반려동물 도구 ============
  {
    id: 'bmi-calculator',
    name_ko: 'BMI 계산기',
    name_en: 'BMI Calculator',
    name_ja: 'BMI計算機',
    name_zh: 'BMI计算器',
    name_es: 'Calculadora de IMC',
    description_ko: '체질량지수(BMI)와 비만도를 확인해요',
    description_en: 'Calculate Body Mass Index (BMI)',
    category: 'health',
    keywords: [
      'BMI', '체질량지수', '비만', '체중', '키', '비만도',
      'BMI계산', '비만계산기', '다이어트', '정상체중', '건강'
    ],
    route: '/tools/bmi-calculator/',
    icon: '⚖️',
    isNew: true,
  },
  {
    id: 'pet-calorie',
    name_ko: '반려동물 칼로리 계산기',
    name_en: 'Pet Calorie Calculator',
    name_ja: 'ペットカロリー計算機',
    name_zh: '宠物热量计算器',
    name_es: 'Calculadora de calorías para mascotas',
    description_ko: '강아지/고양이 1일 권장 칼로리를 계산해요',
    description_en: 'Calculate daily calorie needs for dogs and cats',
    category: 'health',
    keywords: [
      '반려동물', '강아지', '고양이', '칼로리', '사료', '급여량',
      '펫', 'pet', '사료량', 'RER', 'DER', '반려견', '반려묘'
    ],
    route: '/tools/pet-calorie/',
    icon: '🐾',
    isNew: true,
  },

  // ============ 재미/놀이 도구 ============
  {
    id: 'lunch-menu',
    name_ko: '점심 메뉴 추천',
    name_en: 'Lunch Menu Picker',
    name_ja: 'ランチメニュー提案',
    name_zh: '午餐推荐',
    name_es: 'Sugerencia de menú de almuerzo',
    description_ko: '오늘 점심 뭐 먹지? 랜덤으로 추천받아요',
    description_en: 'Get random lunch menu recommendations',
    category: 'fun',
    keywords: [
      '점심', '메뉴', '추천', '뭐먹지', '랜덤', '룰렛',
      '점심메뉴', '메뉴추천', '밥', '음식', '오늘점심'
    ],
    route: '/tools/lunch-menu/',
    icon: '🍱',
    isNew: true,
    isPopular: true,
  },
  {
    id: 'ladder-game',
    name_ko: '사다리 타기',
    name_en: 'Ladder Game',
    name_ja: 'はしごゲーム',
    name_zh: '梯子游戏',
    name_es: 'Juego de escalera',
    description_ko: '사다리 게임으로 당첨자를 정해요',
    description_en: 'Play ladder game to decide winners',
    category: 'fun',
    keywords: [
      '사다리', '제비뽑기', '게임', '추첨', '당첨', '사다리타기',
      '사다리게임', '랜덤추첨', '순서정하기', '뽑기'
    ],
    route: '/tools/ladder-game/',
    icon: '🪜',
    isNew: true,
  },

  // ============ 영상 도구 ============
  {
    id: 'video-to-audio',
    name_ko: '영상 → 오디오 변환',
    name_en: 'Video to Audio',
    name_ja: 'ビデオをオーディオに変換',
    name_zh: '视频转音频',
    name_es: 'Video a Audio',
    description_ko: '영상 파일에서 오디오만 추출해요',
    description_en: 'Extract audio from video files',
    category: 'video',
    keywords: [
      '영상', '비디오', '오디오', '음성', '추출', '변환',
      '동영상', '음악', '오디오추출', '영상변환', 'mp3', 'mp4',
      'mkv', 'webm', '음성추출', '오디오파일'
    ],
    route: '/tools/video-to-audio/',
    icon: '🎵',
    isNew: true,
    isPopular: true,
  },
];

/**
 * 도구 ID로 조회
 */
export function getToolById(id: string): Tool | undefined {
  return TOOLS_REGISTRY.find(tool => tool.id === id);
}

/**
 * 카테고리별 도구 조회
 */
export function getToolsByCategory(category: string): Tool[] {
  return TOOLS_REGISTRY.filter(tool => tool.category === category);
}

/**
 * 인기 도구 조회
 */
export function getPopularTools(): Tool[] {
  return TOOLS_REGISTRY.filter(tool => tool.isPopular);
}

/**
 * 새로 추가된 도구 조회
 */
export function getNewTools(): Tool[] {
  return TOOLS_REGISTRY.filter(tool => tool.isNew);
}

/**
 * 모든 도구 조회
 */
export function getAllTools(): Tool[] {
  return TOOLS_REGISTRY;
}
