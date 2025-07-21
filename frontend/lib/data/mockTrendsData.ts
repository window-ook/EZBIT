import { ITopCoins } from '@/types/upbit/topCoins';

/** Mock 데이터 사용 여부 */
export const USE_MOCK_TRENDS_DATA = true;

/** 일 매수 체결강도 TOP 5 Mock 데이터 */
export const mockDailyTopBid: ITopCoins[] = [
    { rank: 1, name: '이더리움', code: 'ETH/KRW', rate: 85.2 },
    { rank: 2, name: '비트코인', code: 'BTC/KRW', rate: 78.9 },
    { rank: 3, name: '솔라나', code: 'SOL/KRW', rate: 92.1 },
    { rank: 4, name: '리플', code: 'XRP/KRW', rate: 76.4 },
    { rank: 5, name: '에이다', code: 'ADA/KRW', rate: 83.7 }
];

/** 시가총액 TOP 5 Mock 데이터 */
export const mockMarketCapTop: ITopCoins[] = [
    { rank: 1, name: '비트코인', code: 'BTC/KRW', rate: 2.5 },
    { rank: 2, name: '이더리움', code: 'ETH/KRW', rate: 1.8 },
    { rank: 3, name: '테더', code: 'USDT/KRW', rate: 0.1 },
    { rank: 4, name: '솔라나', code: 'SOL/KRW', rate: 3.2 },
    { rank: 5, name: '리플', code: 'XRP/KRW', rate: -0.5 }
];


/** 일 매수 체결강도 Mock 조회 */
export async function fetchDailyTopBidMock(): Promise<ITopCoins[]> {
    await new Promise(resolve => setTimeout(resolve, 150)); // 0.15초 지연
    console.log('✅ 일 매수 체결강도 조회 (Mock): 5개 데이터');
    return mockDailyTopBid;
}

/** 시가총액 TOP Mock 조회 */
export async function fetchMarketCapTopMock(): Promise<ITopCoins[]> {
    await new Promise(resolve => setTimeout(resolve, 100)); // 0.1초 지연
    console.log('✅ 시가총액 TOP 5 조회 (Mock): 5개 데이터');
    return mockMarketCapTop;
} 