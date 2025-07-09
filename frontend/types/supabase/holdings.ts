/** Supabase 보유 종목
 * @warning 한 유저가 같은 코인을 중복 보유하지 않도록 user_id와 market를 조합으로 유니크 키로 설정
 * @property {string} user_id - 보유 종목 주체 ID
 * @property {string} market - 보유 종목
 * @property {number} total_bid_volume - 매수 총 거래량
 * @property {number} total_bid_amount - 매수 총 금액
 * @property {number} avg_bid_price - 매수 평균 가격
 * @property {string} created_at - 보유 종목 생성 시간
 * @property {string} updated_at - 보유 종목 수정 시간
 */
export interface ISupabaseHoldings {
    user_id: string,
    market: string,
    total_bid_volume: number,
    total_bid_amount: number,
    avg_bid_price: number,
    created_at: string,
    updated_at: string
}