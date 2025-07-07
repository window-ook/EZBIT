/**
 * 종목 리스트, 종목 상세 정보 컴포넌트에 필요한 현재가 정보
 * @description 정제된 현재가 정보
 * @property {string} market - 종목 코드
 * @property {number} trade_price - 현재가
 * @property {number} prev_closing_price - 전일 종가
 * @property {number} signed_change_rate - 전일 대비 변동률
 * @property {number} signed_change_price - 전일 대비 변동금액
 * @property {number} acc_trade_price_24h - 24시간 누적 거래대금
 * @property {number} acc_trade_volume_24h - 24시간 누적 거래량
 * @property {number} high_price - 고가
 * @property {number} low_price - 저가
 * @property {number} lowest_52_week_price - 52주 신저가
 * @property {number} highest_52_week_price - 52주 신고가
 */
export interface ITicker {
    market: string;
    trade_price: number;
    prev_closing_price: number;
    signed_change_rate: number;
    signed_change_price: number;
    acc_trade_price_24h: number;
    acc_trade_volume_24h: number;
    high_price: number;
    low_price: number;
    lowest_52_week_price: number;
    highest_52_week_price: number;
}