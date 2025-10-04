import { PortfolioOption } from '@/types/portfolio-pilot';
import { ITopCoins } from '@/types/upbit/topCoins';

export interface IPortfolioOption {
    key: PortfolioOption;
    title: string;
    description: string;
    tendency: string;
    stability?: number;
    profitability?: number;
}

export const PORTFOLIO_OPTIONS: IPortfolioOption[] = [
    {
        key: 'rising-star',
        title: '라이징 스타',
        description: '📈 실시간 상승률 TOP 5',
        tendency: '지금 가장 핫한 코인으로 단기적인 수익을 기대하는 분에게 추천드려요!',
        stability: 4,
        profitability: 4,
    },
    {
        key: 'best-seller',
        title: '베스트 셀러',
        description: '💸 24시간 거래대금 TOP 5',
        tendency: '활발한 거래가 이루어지는 인기 코인으로 단기적인 수익을 원하는 분에게 추천드려요!',
        stability: 3,
        profitability: 5,
    },
    {
        key: 'giants',
        title: '자이언트',
        description: '🔍 시가총액 TOP 5',
        tendency: '시가총액 기반의 안정적이고 장기적인 수익을 기대하는 분에게 추천드려요!',
        stability: 5,
        profitability: 3,
    },
];

/** 시가총액 TOP 5 (고정) */
export const MARKET_CAP_TOP_5: Omit<ITopCoins, 'rate'>[] = [
    { rank: 1, name: '비트코인', code: 'BTC/KRW' },
    { rank: 2, name: '이더리움', code: 'ETH/KRW' },
    { rank: 3, name: '리플', code: 'XRP/KRW' },
    { rank: 4, name: '솔라나', code: 'SOL/KRW' },
    { rank: 5, name: '에이다', code: 'ADA/KRW' },
];