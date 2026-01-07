'use server';

import { createServerSupabaseClient } from '@/utils/supabase/server';
import { AUTH_ERROR } from '@/utils/constants/messages';
import { IRecentActivitySummary } from '@/types/my-assets/recentActivity';

/**
 * 7일간 활동 요약 조회 서버 액션
 * @description 최근 거래 활동과 손익 분석 데이터를 조회
 */
export async function getRecentActivitySummary(): Promise<IRecentActivitySummary> {
  const supabase = await createServerSupabaseClient();

  const { data: userData } = await supabase.auth.getUser();
  const user_id = userData.user?.id;

  if (!user_id) throw new Error(AUTH_ERROR.LOGIN_REQUIRED);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  weekAgo.setHours(0, 0, 0, 0);

  const { data: historyData, error } = await supabase
    .from('history')
    .select('*')
    .eq('user_id', user_id);

  if (error) throw new Error(error.message);

  const history = historyData ?? [];

  const todayTransactions = history.filter((h) => new Date(h.created_at) >= today);
  const weekTransactions = history.filter((h) => new Date(h.created_at) >= weekAgo);
  const weekAmount = weekTransactions.reduce((sum, h) => sum + h.total_amount, 0);

  const profitCount = 0;
  const lossCount = 0;
  const maxProfitRate = 0;
  const maxLossRate = 0;

  return {
    transaction_activity: {
      today_count: todayTransactions.length,
      this_week_count: weekTransactions.length,
      total_transaction_amount: weekAmount,
      avg_transaction_amount: weekTransactions.length > 0 ? weekAmount / weekTransactions.length : 0,
    },
    profit_loss_analysis: {
      profit_count: profitCount,
      loss_count: lossCount,
      max_profit_rate: maxProfitRate,
      max_loss_rate: maxLossRate,
    },
  };
}