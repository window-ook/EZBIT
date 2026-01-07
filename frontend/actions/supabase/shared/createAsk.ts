'use server';

import { Database } from 'types_db';
import { createServerSupabaseClient } from '@/utils/supabase/server';
import { AUTH_ERROR, VALIDATION_ERROR, DB_ERROR, LOGIC_ERROR } from '@/utils/constants/messages';

export type UsersUpdate = Database['public']['Tables']['users']['Update'];
export type HoldingsUpdate = Database['public']['Tables']['holdings']['Update'];
export type HistoryInsert = Database['public']['Tables']['history']['Insert'];

/**
 * 매도 주문 서버 액션
 * @param market - 주문 종목
 * @param volume - 주문 수량
 * @param trade_price - 주문 가격
 * @param total_amount - 주문 총액
 * @param original_amount - 원래 매수 금액
 */
export async function createAsk(
    market: string,
    volume: number,
    trade_price: number,
    total_amount: number,
    original_amount: number
): Promise<boolean> {
    if (!market) throw new Error(VALIDATION_ERROR.ORDER_MARKET_REQUIRED);
    if (!volume || volume <= 0) throw new Error(VALIDATION_ERROR.ORDER_AMOUNT_INVALID);
    if (!trade_price || trade_price <= 0) throw new Error(VALIDATION_ERROR.ORDER_PRICE_INVALID);
    if (!total_amount || total_amount <= 0) throw new Error(VALIDATION_ERROR.ORDER_TOTAL_INVALID);
    if (original_amount === undefined || original_amount < 0) throw new Error(VALIDATION_ERROR.ORDER_ORIGINAL_BID_PRICE_INVALID);

    const supabase = await createServerSupabaseClient();
    const user = await supabase.auth.getUser();

    if (!user?.data?.user) throw new Error(AUTH_ERROR.LOGIN_REQUIRED);
    const user_id = user.data.user.id;

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

    if (historyError) throw new Error(DB_ERROR.HISTORY_SAVE_FAIL);

    // 보유 종목 테이블: 해당 종목 차감 또는 삭제
    const { data: holdingRows, error: holdingSelectError } = await supabase
        .from('holdings')
        .select('*')
        .eq('user_id', user_id)
        .eq('market', market);

    if (holdingSelectError) throw new Error(DB_ERROR.HOLDINGS_FETCH_FAIL);
    if (!holdingRows || holdingRows.length === 0) throw new Error(LOGIC_ERROR.HOLDINGS_NOT_FOUND);

    const holdingPrev = holdingRows[0];
    const prevVolume = Number(holdingPrev.total_bid_volume);
    const prevAmount = Number(holdingPrev.total_bid_amount);

    if (prevVolume < volume) throw new Error(LOGIC_ERROR.ASK_AMOUNT_EXCEED);

    const newTotalBidVolume = prevVolume - volume;
    const newTotalBidAmount = prevAmount - total_amount;

    if (newTotalBidVolume > 0) {
        const newAvgBidPrice = newTotalBidAmount / newTotalBidVolume;

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

        if (holdingUpdateError) throw new Error(DB_ERROR.HOLDINGS_UPDATE_FAIL);
    } else {
        const { error: holdingDeleteError } = await supabase
            .from('holdings')
            .delete()
            .eq('user_id', user_id)
            .eq('market', market);

        if (holdingDeleteError) throw new Error(DB_ERROR.HOLDINGS_DELETE_FAIL);
    }

    // 유저 정보 테이블: 보유 KRW, 총 보유 자산 업데이트
    const { data: userRows, error: userSelectError } = await supabase
        .from('users')
        .select('*')
        .eq('user_id', user_id);

    if (userSelectError) throw new Error(DB_ERROR.USER_INFO_FETCH_FAIL);
    if (!userRows || userRows.length === 0) throw new Error(LOGIC_ERROR.USER_NOT_FOUND);

    const userPrev = userRows[0];
    const newHoldingKRW = Number(userPrev.holding_krw) + total_amount;
    let newTotalInvested = Number(userPrev.total_invested) - original_amount;
    if (Math.abs(newTotalInvested) < 1e-6) newTotalInvested = 0;

    const { error: userUpdateError } = await supabase
        .from('users')
        .update<UsersUpdate>({
            holding_krw: newHoldingKRW,
            total_invested: newTotalInvested,
            updated_at: new Date().toISOString(),
        })
        .eq('user_id', user_id);

    if (userUpdateError) throw new Error(DB_ERROR.USER_INFO_UPDATE_FAIL);

    return true;
}