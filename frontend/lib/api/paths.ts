/** 외부 API 경로 정의
 * @property {string} TRENDS.YOUTUBE_VIDEOS 영상 데이터
 * @property {string} exchangeRate 환율 데이터
 */
export const EXTERNAL_PATHS = {
    TRENDS: {
        YOUTUBE_VIDEOS: '/mock/youtube_videos.json',
    },
    exchangeRate: (API_KEY: string) => `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`,
} as const;

/** 내부 API 경로 정의
 * @property {string} dailyTopBidCoins 일 매수 체결강도 TOP 5
 * @property {string} marketCapTopCoins 시가총액 TOP 5
 * @property {string} situationArticles 시황 뉴스
 * @property {string} topicArticles 토픽 뉴스
 * @property {string} weeklyTopRisedCoins 주간 상승률 TOP 10
 */
export const INTERNAL_PATHS = {
    dailyTopBidCoins: '/api/daily-top-bid',
    marketCapTopCoins: '/api/market-cap-top',
    situationArticles: '/api/situation-articles',
    topicArticles: '/api/topic-articles',
    weeklyTopRisedCoins: '/api/weekly-top-rised',
} as const;