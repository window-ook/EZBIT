/** 포트폴리오 옵션 타입 */
export type PortfolioOptionType = 'weekly' | 'today' | 'giant';

/** 포트폴리오 아이템 인터페이스
 * @property {string} code 코인 코드
 * @property {string} name 코인 이름
 * @property {number} rank 순위
 * @property {number} rate 상승률
 * @property {number} allocatedAmount 할당된 금액
 * @property {number} currentPrice 현재가
 * @property {number} quantity 매수량
 * @property {number} percentage 포트폴리오 내 비중 (%)
 * @property {boolean} canPurchase 매수 가능 여부
 * @property {boolean} isKrwMarket KRW 마켓 여부
 * @property {boolean} isPriceExceeded 가격 초과 여부
 */
export interface IPortfolioItem {
    code: string;
    name: string;
    rank: number;
    rate: number;
    allocatedAmount: number;
    currentPrice: number;
    quantity: number;
    percentage: number;
    canPurchase: boolean;
    isKrwMarket: boolean;
    isPriceExceeded: boolean;
}

/** 포트폴리오 구성 결과 인터페이스
 * @property {PortfolioOptionType} selectedOption 선택된 옵션
 * @property {number} totalAmount 총 투자 금액
 * @property {IPortfolioItem[]} portfolio 포트폴리오 구성 아이템들
 * @property {number} totalValue 총 포트폴리오 가치
 * @property {number} availableCount 매수 가능한 종목 수
 */
export interface IPortfolioResult {
    selectedOption: PortfolioOptionType;
    totalAmount: number;
    portfolio: IPortfolioItem[];
    totalValue: number;
    availableCount: number;
}

/** 매수 계산 결과 인터페이스
 * @property {string} code 코인 코드
 * @property {number} amount 투자 금액
 * @property {number} price 매수가
 * @property {number} quantity 매수량
 */
export interface IPurchaseCalculation {
    code: string;
    amount: number;
    price: number;
    quantity: number;
}