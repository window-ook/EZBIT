/** 포트폴리오 옵션
 * @property {string} rate 라이징 스타 (상승률)
 * @property {string} volume 베스트 셀러 (거래량)
 * @property {string} giant 자이언트 (시가총액)
 */
export type PortfolioOption = 'rate' | 'volume' | 'giant';

/** 포트폴리오 아이템
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
export interface IPilotItem {
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

/** 포트폴리오 구성 결과
 * @property {PortfolioOptionType} selectedOption 선택된 옵션
 * @property {number} totalAmount 총 투자 금액
 * @property {IPortfolioItem[]} portfolio 포트폴리오 구성 아이템들
 * @property {number} totalValue 총 포트폴리오 가치
 * @property {number} availableCount 매수 가능한 종목 수
 */
export interface IPilotResult {
    selectedOption: PortfolioOption;
    totalAmount: number;
    portfolio: IPilotItem[];
    totalValue: number;
    availableCount: number;
}

/** 포트폴리오 아이템 중 매수 가능 여부로 필터링된 코인 */
export interface IPilotFilteredItem {
    market: string;
    volume: number;
    trade_price: number;
    total_amount: number;
}