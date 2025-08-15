export const tickerQuery = {
    /** 전체 초기 현재가 데이터 쿼리 키 */
    all: () => ['initial-tickers'] as const,

    /** 특정 마켓들의 현재가 데이터 쿼리 키 */
    byMarkets: (markets: string[]) => ['initial-tickers', markets] as const,
} as const;