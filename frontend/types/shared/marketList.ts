/**
 * 종목 리스트에 필요한 현재가 정보
 * @typedef {Object} ITicker
 * @property {string} market - 종목 코드
 * @property {number} trade_price - 현재가
 * @property {number} prev_closing_price - 전일 종가
 * @property {number} signed_change_rate - 전일 대비 변동률
 * @property {number} signed_change_price - 전일 대비 변동금액
 * @property {number} acc_trade_price_24h - 24시간 누적 거래대금
 */
export interface ITicker {
    market: string;
    trade_price: number;
    prev_closing_price: number;
    signed_change_rate: number;
    signed_change_price: number;
    acc_trade_price_24h: number;
}

export type ITickers = ITicker[];