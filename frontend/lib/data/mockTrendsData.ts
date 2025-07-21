import { ITopCoins } from '@/types/upbit/topCoins';

/** Mock 데이터 사용 여부 (임시로 true) */
export const USE_MOCK_TRENDS_DATA = false;

/** 주간 상승률 TOP 10 Mock 데이터 */
export const mockWeeklyTopRised: ITopCoins[] = [
    { rank: 1, name: '비트코인', code: 'BTC/KRW', rate: 12.5 },
    { rank: 2, name: '이더리움', code: 'ETH/KRW', rate: 8.3 },
    { rank: 3, name: '리플', code: 'XRP/KRW', rate: 15.7 },
    { rank: 4, name: '에이다', code: 'ADA/KRW', rate: 6.9 },
    { rank: 5, name: '솔라나', code: 'SOL/KRW', rate: 11.2 },
    { rank: 6, name: '도지코인', code: 'DOGE/KRW', rate: 5.4 },
    { rank: 7, name: '폴리곤', code: 'MATIC/KRW', rate: 9.8 },
    { rank: 8, name: '체인링크', code: 'LINK/KRW', rate: 7.6 },
    { rank: 9, name: '아발란체', code: 'AVAX/KRW', rate: 13.1 },
    { rank: 10, name: '유니스왑', code: 'UNI/KRW', rate: 4.8 }
];

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

/** 주간 상승률 Mock 조회 */
export async function fetchWeeklyTopRisedMock(): Promise<ITopCoins[]> {
    await new Promise(resolve => setTimeout(resolve, 200)); // 0.2초 지연
    console.log('✅ 주간 상승률 조회 (Mock): 10개 데이터');
    return mockWeeklyTopRised;
}

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