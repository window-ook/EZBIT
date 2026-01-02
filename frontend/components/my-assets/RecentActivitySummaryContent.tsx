"use client";

import { useContext, useEffect, useState } from 'react';
import { useHoldings } from '@/hooks/supabase/holdings/useHoldings';
import { TickerContext } from '@/providers/TickerProvider';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcn-ui/card";
import { IRecentActivitySummary } from '@/types/my-assets/recentActivity';

export interface IRecentActivitySummaryContent {
    initialSummary: IRecentActivitySummary;
}

export default function RecentActivitySummaryContent({ initialSummary }: IRecentActivitySummaryContent) {
    const { tickers } = useContext(TickerContext);
    const { holdings } = useHoldings();
    const [summary, setSummary] = useState<IRecentActivitySummary>(initialSummary);

    useEffect(() => {
        if (!holdings || holdings.length === 0 || !tickers) return;

        let profitCount = 0;
        let lossCount = 0;
        let maxProfitRate = 0;
        let maxLossRate = 0;

        holdings.forEach((holding) => {
            const currentPrice = tickers?.[holding.market]?.trade_price ?? 0;
            if (currentPrice === 0) return;

            const profitRate = ((currentPrice - holding.avg_bid_price) / holding.avg_bid_price) * 100;

            if (profitRate > 0) {
                profitCount++;
                maxProfitRate = Math.max(maxProfitRate, profitRate);
            } else if (profitRate < 0) {
                lossCount++;
                maxLossRate = Math.min(maxLossRate, profitRate);
            }
        });

        setSummary((prev) => {
            const prevAnalysis = prev.profit_loss_analysis;
            if (
                prevAnalysis.profit_count === profitCount &&
                prevAnalysis.loss_count === lossCount &&
                prevAnalysis.max_profit_rate === maxProfitRate &&
                prevAnalysis.max_loss_rate === maxLossRate
            ) return prev;

            return {
                ...prev,
                profit_loss_analysis: {
                    profit_count: profitCount,
                    loss_count: lossCount,
                    max_profit_rate: maxProfitRate,
                    max_loss_rate: maxLossRate,
                },
            };
        });
    }, [holdings, tickers]);

    return (
        <Card
            aria-label='7일간 활동 요약'
            className="size-full">
            <CardHeader>
                <CardTitle className="text-lg font-medium">7일간 활동 요약</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 space-y-6">
                <div className="border-2 border-slate-200 rounded-lg p-4">
                    <h3 className="font-semibold text-base mb-3 text-slate-700">거래 종목</h3>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col">
                            <span className="text-xs text-slate-500 mb-1">오늘 {summary.transaction_activity.today_count}개</span>
                            <span className="text-xs text-slate-500">7일간 {summary.transaction_activity.this_week_count}개</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs text-slate-500 mb-1">
                                총 거래액: {summary.transaction_activity.total_transaction_amount.toLocaleString()}원
                            </span>
                            <span className="text-xs text-slate-500">
                                평균 거래액: {Math.round(summary.transaction_activity.avg_transaction_amount).toLocaleString()}원
                            </span>
                        </div>
                    </div>
                </div>

                <div className="border-2 border-slate-200 rounded-lg p-4">
                    <h3 className="font-semibold text-base mb-3 text-slate-700">손익 분석</h3>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col">
                            <span className="text-xs text-slate-500 mb-1">
                                수익 종목 {summary.profit_loss_analysis.profit_count}개 ▲
                            </span>
                            <span className="text-xs text-slate-500">
                                손실 종목 {summary.profit_loss_analysis.loss_count}개 ▼
                            </span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs text-positive mb-1">
                                최고 수익률 +{summary.profit_loss_analysis.max_profit_rate.toFixed(1)}%
                            </span>
                            <span className="text-xs text-negative">
                                최저 수익률 {summary.profit_loss_analysis.max_loss_rate.toFixed(1)}%
                            </span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}