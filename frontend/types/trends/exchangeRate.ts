/** 환율 인터페이스
 * @property {string} currency 통화
 * @property {number} rate 원화 대비 환율
 */
export interface IExchangeRate {
    currency: string,
    rate: number
}

/** 환율 데이터 API 응답 타입 */
export interface IExchangeRateResponse {
    result: string;
    base_code: string;
    conversion_rates: { [key: string]: number };
    time_last_update_unix: number;
    time_last_update_utc: string;
}