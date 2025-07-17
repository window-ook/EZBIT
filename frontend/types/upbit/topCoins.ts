/** 주간 상승률, 일 매수 체결강도 상위 코인 인터페이스
 * @property {number} rank 순위
 * @property {string} name 코인 이름
 * @property {string} code 코인 코드
 * @property {number} rate 상승률
 */
export interface ITopCoins {
    rank: number;
    name: string;
    code: string;
    rate: number;
}