/** 주간 상승률, 일 매수 체결강도 상위 코인 */
export interface ICrawlTopCoins {
    rank: number;
    name: string;
    code: string;
    rate: number;
}