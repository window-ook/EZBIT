export const EXTERNAL_PATHS = {
    YOUTUBE_VIDEOS: 'https://www.googleapis.com/youtube/v3/search',
    UPBIT: {
        BASE_URL: 'https://api.upbit.com/v1',
        MARKETS: (baseUrl: string) => `${baseUrl}/market/all?is_details=false`,
        TICKER: (baseUrl: string, markets: string) => `${baseUrl}/ticker?markets=${markets}`,
        TRADE_HISTORY: (baseUrl: string, market: string, count: number) => `${baseUrl}/trades/ticks?market=${market}&count=${count}`,
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
    EXCHANGE_RATE: (API_KEY: string) => `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`
} as const;

export const INTERNAL_PATHS = {
    UPBIT: {
        MARKETS: '/api/markets',
        TICKERS: '/api/tickers',
        ORDERBOOK: (market: string) => `/api/orderbook?market=${market}`,
        TRADE_HISTORY: (market: string, count: number) => `/api/trade-history?market=${market}&count=${count}`,
        CANDLES: (searchParams: URLSearchParams) => `/api/candles?${searchParams.toString()}`,
    },
} as const;