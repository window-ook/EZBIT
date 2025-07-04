/** 보유 종목 정보 인터페이스*/
export interface IHoldings {
    user_id: string,
    market: string,
    total_bid_volume: number,
    total_bid_amount: number,
    avg_bid_price: number,
    created_at: string,
    updated_at: string
}