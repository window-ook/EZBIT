/** 업비트 공통 Candle Response
 * @description REST API
 * @see https://docs.upbit.com/kr/reference/%EB%B6%84minute-%EC%BA%94%EB%93%A4-1
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

/** 업비트 일봉 Response */
export interface IUpbitDayCandle extends IUpbitCandle {
    prev_closing_price: number;
    change_price: number;
    change_rate: number;
}

export type IUpbitDayCandles = IUpbitDayCandle[];

/** 업비트 주봉 Response */
export interface IUpbitWeekCandle extends IUpbitCandle {
    first_day_of_period: string;
}

export type IUpbitWeekCandles = IUpbitWeekCandle[];

/** 업비트 월봉 Response */
export interface IUpbitMonthCandle extends IUpbitCandle {
    first_day_of_period: string;
}

export type IUpbitMonthCandles = IUpbitMonthCandle[];