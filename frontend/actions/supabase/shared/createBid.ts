'use server';

import { Database } from 'types_db';
import { createServerSupabaseClient } from '@/utils/supabase/server';

export type UsersInsert = Database['public']['Tables']['users']['Insert'];
export type UsersUpdate = Database['public']['Tables']['users']['Update'];
export type HoldingsInsert = Database['public']['Tables']['holdings']['Insert'];
export type HoldingsUpdate = Database['public']['Tables']['holdings']['Update'];
export type HistoryInsert = Database['public']['Tables']['history']['Insert'];

/** 매수 주문 서버 액션
 * @param market - 주문 종목
 * @param volume - 주문 수량
 * @param trade_price - 주문 가격
 * @param total_amount - 주문 총액
 * @returns true (성공 시)
 * @throws Error (실패 시)
 */
export async function createBid(
    market: string,
    volume: number,
    trade_price: number,
    total_amount: number
): Promise<boolean> {
    const supabase = await createServerSupabaseClient();
    const user = await supabase.auth.getUser();
    if (!user) throw new Error('로그인이 필요합니다.');
    const user_id = user.data.user?.id ?? '';

    // 거래내역 테이블에 매수 주문 추가
    const { error: historyError } = await supabase
        .from('history')
        .insert<HistoryInsert>({
            user_id,
            market,
            order_type: 'BID',
            volume,
            trade_price,
            total_amount,
        });
    if (historyError) throw new Error('거래내역 저장에 실패했습니다.');

    // 보유 종목 테이블 존재하면 업데이트, 없으면 추가
    const { data: holdingRows, error: holdingSelectError } = await supabase
        .from('holdings')
        .select('*')
        .eq('user_id', user_id)
        .eq('market', market);

    if (holdingSelectError) throw new Error('보유 종목 조회에 실패했습니다.');
    if (holdingRows && holdingRows.length > 0) {
        const prev = holdingRows[0]; // 기존 데이터
        const newTotalBidVolume = Number(prev.total_bid_volume) + volume; // 새로운 보유 수량
        const newTotalBidAmount = Number(prev.total_bid_amount) + total_amount; // 새로운 매수 총액
        const newAvgBidPrice = newTotalBidAmount / newTotalBidVolume; // 새로운 평균 매수 가격

        const { error: holdingUpdateError } = await supabase
            .from('holdings')
            .update<HoldingsUpdate>({
                total_bid_volume: newTotalBidVolume,
                total_bid_amount: newTotalBidAmount,
                avg_bid_price: newAvgBidPrice,
                updated_at: new Date().toISOString(),
            })
            .eq('user_id', user_id)
            .eq('market', market);

        if (holdingUpdateError) throw new Error('보유 종목 업데이트에 실패했습니다.');
    } else {
        // 신규 종목 추가
        const { error: holdingInsertError } = await supabase
            .from('holdings')
            .insert<HoldingsInsert>({
                user_id,
                market,
                total_bid_volume: volume,
                total_bid_amount: total_amount,
                avg_bid_price: trade_price,
                created_at: new Date().toISOString(),
            });

        if (holdingInsertError) throw new Error('보유 종목 추가에 실패했습니다.');
    }

    // 유저 정보 테이블 업데이트
    const { data: userRows, error: userSelectError } = await supabase
        .from('users')
        .select('*')
        .eq('user_id', user_id);

    if (userSelectError) throw new Error('유저 정보 조회에 실패했습니다.');
    if (userRows && userRows.length > 0) {
        const prev = userRows[0];
        const newHoldingKRW = Number(prev.holding_krw) - total_amount; // 기존 보유 KRW - 매수 주문 총액
        const newTotalInvested = Number(prev.total_invested) + total_amount; // 기존 총 투자 금액 + 매수 주문 총액
        const { error: userUpdateError } = await supabase
            .from('users')
            .update<UsersUpdate>({
                holding_krw: newHoldingKRW,
                total_invested: newTotalInvested,
                updated_at: new Date().toISOString(),
            })
            .eq('user_id', user_id);
        if (userUpdateError) throw new Error('유저 정보 업데이트에 실패했습니다.');
    }

    return true;
}