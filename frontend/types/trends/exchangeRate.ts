/** 환율 인터페이스
 * @property {string} currency 통화
 * @property {number} rate 원화 대비 환율
 */
export interface IExchangeRate {
    currency: string,
    rate: number
}