/** 단위 거래당 호가 인터페이스
 * @property {number} ask_price 매도 호가
 * @property {number} bid_price 매수 호가
 * @property {number} ask_size 매도 거래량
 * @property {number} bid_size 매수 거래량
 */
export interface IUpbitOrderbookUnit {
    ask_price: number;
    bid_price: number;
    ask_size: number;
    bid_size: number;
}

/** 업비트 종목 단위 호가 정보(오더북) Response
 * @description WebSocket API
 * @see https://docs.upbit.com/kr/reference/websocket-orderbook
 * @property {string} code 종목 코드
 * @property {number} total_ask_size 총 매도 거래량
 * @property {number} total_bid_size 총 매수 거래량
 * @property {IUpbitOrderbookUnit[]} orderbook_units 단위 거래당 호가
 * @property {number} timestamp 호가 정보 생성 시간
 */
export interface IUpbitOrderbook {
    code: string;
    total_ask_size: number;
    total_bid_size: number;
    orderbook_units: IUpbitOrderbookUnit[];
    timestamp: number;
}