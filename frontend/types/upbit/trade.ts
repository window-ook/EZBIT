/** 업비트 종목 단위 체결 정보(거래 내역) Response
 * @description WebSocket API
 * @see https://docs.upbit.com/kr/reference/websocket-trade
 * */
export interface IUpbitTrade {
    code: string;
    trade_price: number;
    trade_volume: number;
    ask_bid: 'ASK' | 'BID';
    prev_closing_price: number;
    change: string;
    change_price: number;
    trade_date: string;
    trade_time: string;
    trade_timestamp: number;
    timestamp: number;
    sequential_id: number;
}