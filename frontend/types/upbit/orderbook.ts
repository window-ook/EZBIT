/** 단위 거래당 호가 */
export interface IUpbitOrderbookUnit {
    ask_price: number;
    bid_price: number;
    ask_size: number;
    bid_size: number;
}

/** 업비트 종목 단위 호가 정보(오더북) Response
 * @description WebSocket API
 * @see https://docs.upbit.com/kr/reference/websocket-orderbook
 * */
export interface IUpbitOrderbook {
    code: string;
    total_ask_size: number;
    total_bid_size: number;
    orderbook_units: IUpbitOrderbookUnit[];
    timestamp: number;
}