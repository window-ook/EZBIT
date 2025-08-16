/** 외부 API 경로
 * @property {string} TRENDS.YOUTUBE_VIDEOS 영상 데이터
 * @property {string} exchangeRate 환율 데이터
 * @property {string} UPBIT.BASE_URL 업비트 API 기본 URL
 * @property {string} UPBIT.MARKETS 전체 마켓 목록
 * @property {string} UPBIT.TICKER 현재가 정보
 * @property {string} UPBIT.TRADES 체결내역
 * @property {string} UPBIT.ORDERBOOK 호가 정보
 * @property {string} UPBIT.CANDLES 캔들 차트 데이터
 */
export const EXTERNAL_PATHS = {
    TRENDS: {
        YOUTUBE_VIDEOS: 'https://www.googleapis.com/youtube/v3/search',
    },
    exchangeRate: (API_KEY: string) => `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`,
    UPBIT: {
        BASE_URL: 'https://api.upbit.com/v1',
        MARKETS: (baseUrl: string) => `${baseUrl}/market/all?is_details=false`,
        TICKER: (baseUrl: string, markets: string) => `${baseUrl}/ticker?markets=${markets}`,
        TRADES: (baseUrl: string, market: string, count: number) => `${baseUrl}/trades/ticks?market=${market}&count=${count}`,
        ORDERBOOK: (baseUrl: string, market: string) => `${baseUrl}/orderbook?markets=${market}`,
        CANDLES: {
            MINUTES: (baseUrl: string, unit: number, market: string, count?: number, to?: string) => {
                let url = `${baseUrl}/candles/minutes/${unit}?market=${market}`;
                if (count) url += `&count=${count}`;
                if (to) url += `&to=${to}`;
                return url;
            },
            DAYS: (baseUrl: string, market: string, count?: number, to?: string) => {
                let url = `${baseUrl}/candles/days?market=${market}`;
                if (count) url += `&count=${count}`;
                if (to) url += `&to=${to}`;
                return url;
            },
            WEEKS: (baseUrl: string, market: string, count?: number, to?: string) => {
                let url = `${baseUrl}/candles/weeks?market=${market}`;
                if (count) url += `&count=${count}`;
                if (to) url += `&to=${to}`;
                return url;
            },
            MONTHS: (baseUrl: string, market: string, count?: number, to?: string) => {
                let url = `${baseUrl}/candles/months?market=${market}`;
                if (count) url += `&count=${count}`;
                if (to) url += `&to=${to}`;
                return url;
            },
        },
    },
} as const;

/** 내부 API 경로
 * @description 라우트 핸들러 경로. feature별로 그룹화.
 * @property {string} TRENDS.SITUATION_ARTICLES 시황 뉴스
 * @property {string} TRENDS.TOPIC_ARTICLES 토픽 뉴스
 * @property {string} TRENDS.YOUTUBE_VIDEOS 유튜브 비디오
 * @property {string} UPBIT.MARKETS 마켓 목록
 * @property {string} UPBIT.TICKERS 현재가 정보
 * @property {string} UPBIT.ORDERBOOK 호가 정보
 * @property {string} UPBIT.TRADE_HISTORY 체결내역
 * @property {string} CANDLES 캔들 데이터
 * @property {string} EXCHANGE_RATE 환율 정보
 */
export const INTERNAL_PATHS = {
    TRENDS: {
        SITUATION_ARTICLES: '/api/situation-articles',
        TOPIC_ARTICLES: '/api/topic-articles',
        YOUTUBE_VIDEOS: (limit: number) => `/api/youtube-videos?keyword=비트코인&maxResults=${limit}`,
    },
    UPBIT: {
        MARKETS: '/api/markets',
        TICKERS: '/api/tickers',
        ORDERBOOK: (market: string) => `/api/orderbook?market=${market}`,
        TRADE_HISTORY: (market: string, count: number) => `/api/trade-history?market=${market}&count=${count}`,
    },
    CANDLES: (searchParams: URLSearchParams) => `/api/candles?${searchParams.toString()}`,
    EXCHANGE_RATE: '/api/exchange-rate',
} as const;