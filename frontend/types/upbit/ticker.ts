/** 업비트 종목 단위 현재가 정보(티커) Response
 * @description WebSocket API
 * @see https://docs.upbit.com/kr/reference/websocket-ticker
 */
export interface IUpbitTicker {
    type: "ticker";
    code: string;
    opening_price: number;
    high_price: number;
    low_price: number;
    trade_price: number;
    prev_closing_price: number;
    acc_trade_price: number;
    change: string;
    change_price: number;
    signed_change_price: number;
    change_rate: number;
    signed_change_rate: number;
    ask_bid: string;
    trade_volume: number;
    acc_trade_volume: number;
    trade_date: string;
    trade_time: string;
    trade_timestamp: number;
    acc_ask_volume: number;
    acc_bid_volume: number;
    highest_52_week_price: number;
    highest_52_week_date: string;
    lowest_52_week_price: number;
    lowest_52_week_date: string;
    market_state: string;
    is_trading_suspended: boolean;
    delisting_date: Date | null;
    market_warning: string;
    timestamp: number;
    acc_trade_price_24h: number;
    acc_trade_volume_24h: number;
    stream_type: string;
}

/** 업비트 종목 단위 현재가 정보(티커) Response
 * @description REST API
 */
export interface IUpbitRestTicker {
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

/**
 * 응답 중에서 실제로 사용하는 현재가 인터페이스
 * @description useTickerSocket, TickerProvider 에서 사용
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