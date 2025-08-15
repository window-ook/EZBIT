export const tickerQuery = {
    /** 전체 초기 현재가 데이터 쿼리 키 */
    all: () => ['initial-tickers'] as const,

    /** 특정 마켓 수에 따른 초기 현재가 데이터 쿼리 키 */
    byMarketsCount: (count: number) => ['initial-tickers', count] as const,

    /** 특정 마켓들의 현재가 데이터 쿼리 키 */
    byMarkets: (markets: string[]) => ['initial-tickers', markets] as const,
} as const;