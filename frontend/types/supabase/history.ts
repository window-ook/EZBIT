/** 
 * Supabase 거래 내역
 * @property {string} id - 거래 내역 ID
 * @property {string} user_id - 거래 내역 주체 ID
 * @property {string} market - 거래 내역 종목
 * @property {'BID' | 'ASK'} order_type - 거래 내역 종류
 * @property {number} volume - 거래 내역 거래량
 * @property {number} trade_price - 거래 내역 거래 가격
 * @property {number} total_amount - 거래 내역 총 금액
 * @property {string} created_at - 거래 내역 생성 시간
 */
export interface ISupabaseHistory {
    id: string,
    user_id: string,
    market: string,
    order_type: 'BID' | 'ASK',
    volume: number,
    trade_price: number,
    total_amount: number,
    created_at: string,
}