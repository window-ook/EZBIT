'use server';

import { createServerSupabaseClient } from '@/utils/supabase/server';
import { AUTH_ERROR, VALIDATION_ERROR, DB_ERROR, LOGIC_ERROR } from '@/utils/constants/messages';
import { IPilotFilteredItem } from '@/types/portfolio-pilot';
import { Database } from 'types_db';

export type UsersInsert = Database['public']['Tables']['users']['Insert'];
export type UsersUpdate = Database['public']['Tables']['users']['Update'];
export type HoldingsInsert = Database['public']['Tables']['holdings']['Insert'];
export type HoldingsUpdate = Database['public']['Tables']['holdings']['Update'];
export type HistoryInsert = Database['public']['Tables']['history']['Insert'];

export interface ICreateBidWithPortfolioPilotResult {
    successCount: number;
    errors: string[];
}

/**
 * 포트폴리오 파일럿 매수 주문 서버 액션
 * @param orders - 매수 주문 배열
 */
export async function createBidWithPortfolioPilot(
    orders: IPilotFilteredItem[]
): Promise<ICreateBidWithPortfolioPilotResult> {
    if (!orders || orders.length === 0) throw new Error(VALIDATION_ERROR.ORDER_LIST_EMPTY);

    const invalidOrder = orders.find(
        (order) => !order.market || !order.volume || order.volume <= 0 || !order.trade_price || order.trade_price <= 0 || !order.total_amount || order.total_amount <= 0
    );
    if (invalidOrder) throw new Error(VALIDATION_ERROR.ORDER_INVALID(invalidOrder.market || '알 수 없음'));

    const supabase = await createServerSupabaseClient();
    const user = await supabase.auth.getUser();

    if (!user?.data?.user) throw new Error(AUTH_ERROR.LOGIN_REQUIRED);
    const user_id = user.data.user.id;

    const errors: string[] = [];

    let successCount = 0;

    // 사용자 정보 조회
    const { data: userRows, error: userSelectError } = await supabase
        .from('users')
        .select('*')
        .eq('user_id', user_id);

    if (userSelectError || !userRows || userRows.length === 0) throw new Error(DB_ERROR.USER_INFO_FETCH_FAIL);

    const userInfo = userRows[0];
    const totalOrderAmount = orders.reduce((sum, order) => sum + order.total_amount, 0);

    // 보유 KRW 잔액 확인
    if (Number(userInfo.holding_krw) < totalOrderAmount) throw new Error(LOGIC_ERROR.KRW_INSUFFICIENT);

    const successfulOrders: IPilotFilteredItem[] = [];

    // 각 종목별 매수 주문
    for (const order of orders) {
        // 1. 거래 내역 테이블 추가
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
            errors.push(DB_ERROR.HISTORY_SAVE_FAIL_WITH_MARKET(order.market));
            continue;
        }

        // 2. 보유 종목 테이블 업데이트
        const { data: holdingRows, error: holdingSelectError } = await supabase
            .from('holdings')
            .select('*')
            .eq('user_id', user_id)
            .eq('market', order.market);

        if (holdingSelectError) {
            errors.push(DB_ERROR.HOLDINGS_FETCH_FAIL_WITH_MARKET(order.market));
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
                errors.push(DB_ERROR.HOLDINGS_UPDATE_FAIL_WITH_MARKET(order.market));
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
                errors.push(DB_ERROR.HOLDINGS_INSERT_FAIL_WITH_MARKET(order.market));
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

        if (userUpdateError) throw new Error(DB_ERROR.USER_INFO_UPDATE_FAIL);
    }

    return { successCount, errors };
}