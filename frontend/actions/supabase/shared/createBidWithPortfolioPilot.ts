'use server';

import { createServerSupabaseClient } from '@/utils/supabase/server';
import { IPilotFilteredItem } from '@/types/portfolio-pilot/portfolioPilot';
import { Database } from 'types_db';

export type UsersInsert = Database['public']['Tables']['users']['Insert'];
export type UsersUpdate = Database['public']['Tables']['users']['Update'];
export type HoldingsInsert = Database['public']['Tables']['holdings']['Insert'];
export type HoldingsUpdate = Database['public']['Tables']['holdings']['Update'];
export type HistoryInsert = Database['public']['Tables']['history']['Insert'];

/** 포트폴리오 매수 주문 서버 액션
 * @param orders - 매수 주문 배열
 * @returns {Promise<{ success: boolean; errors: string[]; message?: string }>}
 */
export async function createBidWithPortfolioPilot(
    orders: IPilotFilteredItem[]
): Promise<{ success: boolean; errors: string[]; message?: string }> {
    const supabase = await createServerSupabaseClient();
    const user = await supabase.auth.getUser();

    if (!user) return { success: false, errors: [], message: '로그인이 필요합니다.' };

    const user_id = user.data.user?.id ?? '';

    const errors: string[] = [];

    let successCount = 0;

    // 사용자 정보 조회
    const { data: userRows, error: userSelectError } = await supabase
        .from('users')
        .select('*')
        .eq('user_id', user_id);

    if (userSelectError || !userRows || userRows.length === 0) return { success: false, errors: [], message: '유저 정보 조회에 실패했습니다.' };

    const userInfo = userRows[0];
    const totalOrderAmount = orders.reduce((sum, order) => sum + order.total_amount, 0);

    // 보유 KRW 잔액 확인
    if (Number(userInfo.holding_krw) < totalOrderAmount) return { success: false, errors: [], message: '보유 KRW가 부족합니다.' };

    const successfulOrders: IPilotFilteredItem[] = [];

    // 각 종목별 매수 주문
    for (const order of orders) {
        // 1. 거래내역 테이블 추가
        const { error: historyError } = await supabase
            .from('history')
            .insert<HistoryInsert>({
                user_id,
                market: order.market,
                order_type: 'BID',
                volume: order.volume,
                trade_price: order.trade_price,
                total_amount: order.total_amount,
            });

        if (historyError) {
            errors.push(`${order.market}: 거래내역 저장 실패`);
            continue;
        }

        // 2. 보유 종목 테이블 업데이트
        const { data: holdingRows, error: holdingSelectError } = await supabase
            .from('holdings')
            .select('*')
            .eq('user_id', user_id)
            .eq('market', order.market);

        if (holdingSelectError) {
            errors.push(`${order.market}: 보유 종목 조회 실패`);
            continue;
        }

        if (holdingRows && holdingRows.length > 0) {
            // 보유 종목 테이블: 존재하면 업데이트
            const prev = holdingRows[0];
            const newTotalBidVolume = Number(prev.total_bid_volume) + order.volume;
            const newTotalBidAmount = Number(prev.total_bid_amount) + order.total_amount;
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
                .eq('market', order.market);

            if (holdingUpdateError) {
                errors.push(`${order.market}: 보유 종목 업데이트 실패`);
                continue;
            }
        } else {
            const { error: holdingInsertError } = await supabase
                .from('holdings')
                .insert<HoldingsInsert>({
                    user_id,
                    market: order.market,
                    total_bid_volume: order.volume,
                    total_bid_amount: order.total_amount,
                    avg_bid_price: order.trade_price,
                    created_at: new Date().toISOString(),
                });

            if (holdingInsertError) {
                errors.push(`${order.market}: 보유 종목 추가 실패`);
                continue;
            }
        }

        successfulOrders.push(order);
        successCount++;
    }

    // 3. 사용자 정보 업데이트
    if (successCount > 0) {
        const successfulOrderAmount = successfulOrders.reduce((sum, order) => sum + order.total_amount, 0);
        const newHoldingKRW = Number(userInfo.holding_krw) - successfulOrderAmount;
        const newTotalInvested = Number(userInfo.total_invested) + successfulOrderAmount;

        const { error: userUpdateError } = await supabase
            .from('users')
            .update<UsersUpdate>({
                holding_krw: newHoldingKRW,
                total_invested: newTotalInvested,
                updated_at: new Date().toISOString(),
            })
            .eq('user_id', user_id);

        if (userUpdateError) return { success: false, errors: [], message: '유저 정보 업데이트에 실패했습니다.' };
    }

    return {
        success: successCount > 0,
        errors
    };
}