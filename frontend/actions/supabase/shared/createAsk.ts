'use server';

import { Database } from 'types_db';
import { createServerSupabaseClient } from '@/utils/supabase/server';
import { IServerActionResponse } from '@/types/common/serverAction';

export type UsersUpdate = Database['public']['Tables']['users']['Update'];
export type HoldingsUpdate = Database['public']['Tables']['holdings']['Update'];
export type HistoryInsert = Database['public']['Tables']['history']['Insert'];

/** 매도 주문 서버 액션
 * @param market - 주문 종목
 * @param volume - 주문 수량
 * @param trade_price - 주문 가격
 * @param total_amount - 주문 총액
 * @returns {Promise<IServerActionResponse>}
 */
export async function createAsk(
    market: string,
    volume: number,
    trade_price: number,
    total_amount: number,
    original_amount: number
): Promise<IServerActionResponse> {
    const supabase = await createServerSupabaseClient();
    const user = await supabase.auth.getUser();

    if (!user) return { success: false, message: '로그인이 필요합니다.' };

    const user_id = user.data.user?.id ?? '';

    // 거래 내역 테이블: 매도 주문 추가
    const { error: historyError } = await supabase
        .from('history')
        .insert<HistoryInsert>({
            user_id,
            market,
            order_type: 'ASK',
            volume,
            trade_price,
            total_amount,
        });

    if (historyError) return { success: false, message: '거래 내역 저장에 실패했습니다.' };

    // 보유 종목 테이블: 해당 종목 차감 또는 삭제
    const { data: holdingRows, error: holdingSelectError } = await supabase
        .from('holdings')
        .select('*')
        .eq('user_id', user_id)
        .eq('market', market);

    if (holdingSelectError) return { success: false, message: '보유 종목 조회에 실패했습니다.' };

    if (holdingRows && holdingRows.length > 0) {
        const prev = holdingRows[0];
        const prevVolume = Number(prev.total_bid_volume);
        const prevAmount = Number(prev.total_bid_amount);

        if (prevVolume < volume) return { success: false, message: '매도 수량이 보유 수량을 초과합니다.' };

        const newTotalBidVolume = prevVolume - volume;
        const newTotalBidAmount = prevAmount - total_amount;

        if (newTotalBidVolume > 0) {
            const newAvgBidPrice = newTotalBidVolume > 0 ? newTotalBidAmount / newTotalBidVolume : 0;

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

            if (holdingUpdateError) return { success: false, message: '보유 종목 업데이트에 실패했습니다.' };
        } else {
            const { error: holdingDeleteError } = await supabase
                .from('holdings')
                .delete()
                .eq('user_id', user_id)
                .eq('market', market);

            if (holdingDeleteError) return { success: false, message: '보유 종목 삭제에 실패했습니다.' };
        }
    }

    // 유저 정보 테이블: 보유 KRW, 총 보유 자산 업데이트
    const { data: userRows, error: userSelectError } = await supabase
        .from('users')
        .select('*')
        .eq('user_id', user_id);

    if (userSelectError) return { success: false, message: '유저 정보 조회에 실패했습니다.' };

    if (userRows && userRows.length > 0) {
        const prev = userRows[0];
        const newHoldingKRW = Number(prev.holding_krw) + total_amount;
        let newTotalInvested = Number(prev.total_invested) - original_amount;
        if (Math.abs(newTotalInvested) < 1e-6) newTotalInvested = 0;

        const { error: userUpdateError } = await supabase
            .from('users')
            .update<UsersUpdate>({
                holding_krw: newHoldingKRW,
                total_invested: newTotalInvested,
                updated_at: new Date().toISOString(),
            })
            .eq('user_id', user_id);

        if (userUpdateError) return { success: false, message: '유저 정보 업데이트에 실패했습니다.' };
    }

    return { success: true };
}