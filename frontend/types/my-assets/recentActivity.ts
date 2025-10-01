/** 최근 거래 활동 요약
 * @property {number} today_count - 오늘 거래 건수
 * @property {number} this_week_count - 이번주 거래 건수
 * @property {number} total_transaction_amount - 총 거래액
 * @property {number} avg_transaction_amount - 평균 거래액
 */
export interface IRecentTransactionActivity {
  today_count: number;
  this_week_count: number;
  total_transaction_amount: number;
  avg_transaction_amount: number;
}

/** 손익 분석
 * @property {number} profit_count - 수익 코인 개수
 * @property {number} loss_count - 손실 코인 개수
 * @property {number} max_profit_rate - 최고 수익률
 * @property {number} max_loss_rate - 최저 수익률
 */
export interface IProfitLossAnalysis {
  profit_count: number;
  loss_count: number;
  max_profit_rate: number;
  max_loss_rate: number;
}

/** 최근 활동 요약
 * @property {IRecentTransactionActivity} transaction_activity - 최근 거래 활동
 * @property {IProfitLossAnalysis} profit_loss_analysis - 손익 분석
 */
export interface IRecentActivitySummary {
  transaction_activity: IRecentTransactionActivity;
  profit_loss_analysis: IProfitLossAnalysis;
}
