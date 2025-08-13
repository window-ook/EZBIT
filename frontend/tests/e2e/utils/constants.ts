/**
 * E2E 테스트에서 사용하는 공통 상수들
 */

// 기본 URL 설정
export const BASE_URL = 'http://localhost:3000' as const;

// 페이지 URL
export const PAGE_URLS = {
  HOME: BASE_URL,
  SIGNIN: `${BASE_URL}/signin`,
  SIGNUP: `${BASE_URL}/signup`,
  EXCHANGE: `${BASE_URL}/exchange`,
  TRENDS: `${BASE_URL}/trends`,
  PORTFOLIO_PILOT: `${BASE_URL}/portfolio-pilot`,
  MY_ASSETS: `${BASE_URL}/my-assets`,
  HISTORY: `${BASE_URL}/history`,
} as const;

// 테스트 계정 정보
export const TEST_USER = {
  EMAIL: 'test123@example.com',
  PASSWORD: '123567as#',
  NEW_NICKNAME: '안녕하세요',
  ORIGINAL_NICKNAME: '지금은되나',
} as const;

// 유효성 검증용 테스트 데이터
export const TEST_DATA = {
  INVALID_EMAIL: 'invalid@email@example.com',
  EMPTY_EMAIL: '',
  WEAK_PASSWORD: '1235678',
  LONG_NICKNAME: 'A'.repeat(25),
  INVALID_NICKNAME: 'test@!@23',
  SPACE_ONLY_NICKNAME: '   ',
} as const;

// Supabase 관련 상수
export const SUPABASE = {
  AUTH_COOKIE_NAME: 'sb-xdbogoztmknejhelrtwx-auth-token',
} as const;

// 대기 시간 설정
export const TIMEOUTS = {
  SHORT: 1000,
  MEDIUM: 3000,
  LONG: 10000,
  EXTRA_LONG: 20000,
  PAGE_LOAD: 30000,
} as const;

// 정규식 패턴
export const PATTERNS = {
  DATE_TIME: /\d+월\s+\d+일\s+\d+:\d+/,
  PERCENTAGE: /%$/,
  YOUTUBE_URL: /youtube\.com/,
  GOOGLE_AUTH_URL: /.*accounts\.google\.com.*/,
} as const;

// 에러 메시지 패턴
export const ERROR_MESSAGES = {
  LOGIN_FAILED: /로그인.*실패|이메일.*비밀번호.*확인|인증.*실패|잘못.*정보|계정.*존재/i,
  EMAIL_FORMAT: /이메일.*형식/i,
  EMAIL_REQUIRED: /이메일.*입력/i,
  PASSWORD_STRENGTH: /비밀번호.*강도|비밀번호.*길이|비밀번호.*조건|최소.*자|영문.*숫자/i,
  EMAIL_VERIFICATION: /이메일.*확인|인증.*메일|확인.*메일/i,
  GENERAL_ERROR: /오류|에러|실패/i,
} as const;

// 성공 메시지 패턴
export const SUCCESS_MESSAGES = {
  PORTFOLIO_BUY_COMPLETED: '포트폴리오 매수 주문이 완료되었습니다!',
} as const;