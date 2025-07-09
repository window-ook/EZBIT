/** 업비트 공통 Candle Response
 * @description REST API
 * @see https://docs.upbit.com/kr/reference/%EB%B6%84minute-%EC%BA%94%EB%93%A4-1
 * @property {string} market 종목
 * @property {string} candle_date_time_utc 캔들 시간 (UTC)
 * @property {string} candle_date_time_kst 캔들 시간 (KST)
 * @property {number} opening_price 시가
 * @property {number} high_price 고가
 * @property {number} low_price 저가
 * @property {number} trade_price 종가
 * @property {number} timestamp 캔들 시간 (Unix Timestamp)
 * @property {number} candle_acc_trade_price 캔들 누적 거래대금
 * @property {number} candle_acc_trade_volume 캔들 누적 거래량
 */
export interface IUpbitCandle {
    market: string;
    candle_date_time_utc: string;
    candle_date_time_kst: string;
    opening_price: number;
    high_price: number;
    low_price: number;
    trade_price: number;
    timestamp: number;
    candle_acc_trade_price: number;
    candle_acc_trade_volume: number;
}

/** 업비트 분봉 Response */
export interface IUpbitMinuteCandle extends IUpbitCandle {
    unit: number;
}

export type IUpbitMinuteCandles = IUpbitMinuteCandle[];

/** 업비트 일봉 Response
 * @property {number} prev_closing_price 전일 종가
 * @property {number} change_price 전일 대비 변동 가격
 * @property {number} change_rate 전일 대비 변동률
 */
export interface IUpbitDayCandle extends IUpbitCandle {
    prev_closing_price: number;
    change_price: number;
    change_rate: number;
}

export type IUpbitDayCandles = IUpbitDayCandle[];

/** 업비트 주봉 Response
 * @property {string} first_day_of_period 주봉 시작 일자
 */
export interface IUpbitWeekCandle extends IUpbitCandle {
    first_day_of_period: string;
}

export type IUpbitWeekCandles = IUpbitWeekCandle[];

/** 업비트 월봉 Response
 * @property {string} first_day_of_period 월봉 시작 일자
 */
export interface IUpbitMonthCandle extends IUpbitCandle {
    first_day_of_period: string;
}

export type IUpbitMonthCandles = IUpbitMonthCandle[];