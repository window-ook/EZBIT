/** 한국수출입은행 환율 API 응답 인터페이스 */
export interface IKoreaEximExchangeRateResponse {
    result: number;
    cur_unit: string;
    cur_nm: string;
    deal_bas_r: string;
}

/** 
 * 환율 인터페이스
 * @property {string} currency 통화
 * @property {number} rate 원화 대비 환율
 */
export interface IExchangeRate {
    currency: string;
    rate: number;
}

/** 환율 조회 응답 인터페이스 */
export interface IExchangeRateResponse {
    exchangeRates: IExchangeRate[];
    searchDate: string;
}

/** Supabase exchange_rates 테이블 인터페이스 */
export interface IExchangeRateDB {
    id: string;
    search_date: string;
    usd_rate: number | null;
    jpy_rate: number | null;
    cnh_rate: number | null;
    eur_rate: number | null;
    created_at: string;
    updated_at: string;
}

/** Supabase exchange_rates 테이블 삽입용 인터페이스 */
export interface IExchangeRateDBInsert {
    search_date: string;
    usd_rate: number | null;
    jpy_rate: number | null;
    cnh_rate: number | null;
    eur_rate: number | null;
}