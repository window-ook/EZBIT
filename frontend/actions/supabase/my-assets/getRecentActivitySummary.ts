'use server';

import { createServerSupabaseClient } from '@/utils/supabase/server';
import { IServerActionResponse } from '@/types/common/serverAction';
import { IRecentActivitySummary } from '@/types/my-assets/recentActivity';

/** 최근 활동 요약 조회 서버 액션
 * @description 최근 거래 활동과 손익 분석 데이터를 조회
 * @returns {Promise<IServerActionResponse<IRecentActivitySummary>>}
 */
export async function getRecentActivitySummary(): Promise<IServerActionResponse<IRecentActivitySummary>> {
  const supabase = await createServerSupabaseClient();

  const { data: userData } = await supabase.auth.getUser();
  const user_id = userData.user?.id;

  if (!user_id) return { success: false, message: '로그인이 필요합니다.' };

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    weekAgo.setHours(0, 0, 0, 0);

    const { data: historyData, error: historyError } = await supabase
      .from('history')
      .select('*')
      .eq('user_id', user_id);

    if (historyError) return { success: false, message: historyError.message };

    const history = historyData ?? [];

    const todayTransactions = history.filter(
      (h) => new Date(h.created_at) >= today
    );

    const weekTransactions = history.filter(
      (h) => new Date(h.created_at) >= weekAgo
    );

    const todayAmount = todayTransactions.reduce((sum, h) => sum + h.total_amount, 0);
    const weekAmount = weekTransactions.reduce((sum, h) => sum + h.total_amount, 0);

    let profitCount = 0;
    let lossCount = 0;
    let maxProfitRate = 0;
    let maxLossRate = 0;

    const summary: IRecentActivitySummary = {
      transaction_activity: {
        today_count: todayTransactions.length,
        this_week_count: weekTransactions.length,
        total_transaction_amount: todayAmount,
        avg_transaction_amount: todayTransactions.length > 0 ? todayAmount / todayTransactions.length : 0,
      },
      profit_loss_analysis: {
        profit_count: profitCount,
        loss_count: lossCount,
        max_profit_rate: maxProfitRate,
        max_loss_rate: maxLossRate,
      },
    };

    return { success: true, data: summary };
  } catch (error) {
    console.error('최근 활동 요약 조회 에러:', error);
    return { success: false, message: '데이터를 가져오는데 실패했습니다.' };
  }
}