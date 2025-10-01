"use client";

import { Suspense, useContext, useEffect, useState } from 'react';
import { getRecentActivitySummary } from '@/actions/supabase/my-assets/getRecentActivitySummary';
import { useUserData } from '@/hooks/supabase/users/useUserData';
import { useHoldings } from '@/hooks/supabase/holdings/useHoldings';
import { TickerContext } from '@/providers/TickerProvider';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcn-ui/card";
import { IRecentActivitySummary } from '@/types/my-assets/recentActivity';

function RecentActivitySummaryContent() {
    const [summary, setSummary] = useState<IRecentActivitySummary | null>(null);
    const [loading, setLoading] = useState(true);

    const { user } = useUserData();
    const { holdings } = useHoldings();
    const { tickers } = useContext(TickerContext);

    useEffect(() => {
        if (!user?.user_id) {
            setLoading(false);
            return;
        }

        const fetchSummary = async () => {
            const result = await getRecentActivitySummary();
            if (result.success && result.data) setSummary(result.data);
            setLoading(false);
        };

        fetchSummary();
    }, [user?.user_id]);

    useEffect(() => {
        if (!summary || holdings.length === 0 || !tickers) return;

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
            if (!prev) return prev;
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
    }, [holdings, tickers, summary, summary?.transaction_activity]);

    if (!user?.user_id) {
        return (
            <Card
                aria-label='최근 활동 요약(로그인 필요)'
                className="size-full">
                <CardHeader>
                    <CardTitle className="text-lg font-medium">최근 활동 요약</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex items-center justify-center">
                    <p className="text-gray-500">로그인이 필요합니다</p>
                </CardContent>
            </Card>
        );
    }

    if (loading) {
        return (
            <Card
                aria-label='최근 활동 요약(로딩중)'
                className="size-full">
                <CardHeader>
                    <CardTitle className="text-lg font-medium">최근 활동 요약</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex items-center justify-center">
                    <LoadingSpinner size='xl' />
                </CardContent>
            </Card>
        );
    }

    if (!summary) {
        return (
            <Card
                aria-label='최근 활동 요약(데이터 없음)'
                className="size-full">
                <CardHeader>
                    <CardTitle className="text-lg font-medium">최근 활동 요약</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex items-center justify-center">
                    <p className="text-gray-500">데이터를 불러올 수 없습니다</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card
            aria-label='최근 활동 요약'
            className="size-full">
            <CardHeader>
                <CardTitle className="text-lg font-medium">최근 활동 요약</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 space-y-6">
                <div className="border-2 border-slate-200 rounded-lg p-4">
                    <h3 className="font-semibold text-base mb-3 text-gray-700">최근 거래 종목</h3>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-500 mb-1">오늘 {summary.transaction_activity.today_count}개</span>
                            <span className="text-xs text-gray-500">이번주 {summary.transaction_activity.this_week_count}개</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-500 mb-1">
                                총 거래액: {summary.transaction_activity.total_transaction_amount.toLocaleString()}원
                            </span>
                            <span className="text-xs text-gray-500">
                                평균 거래액: {Math.round(summary.transaction_activity.avg_transaction_amount).toLocaleString()}원
                            </span>
                        </div>
                    </div>
                </div>

                <div className="border-2 border-slate-200 rounded-lg p-4">
                    <h3 className="font-semibold text-base mb-3 text-gray-700">손익 분석</h3>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-500 mb-1">
                                수익 코인 {summary.profit_loss_analysis.profit_count}개 ▲
                            </span>
                            <span className="text-xs text-gray-500">
                                손실 코인 {summary.profit_loss_analysis.loss_count}개 ▼
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

export default function RecentActivitySummary() {
    return (
        <Suspense fallback={<LoadingSpinner size='2xl' />}>
            <RecentActivitySummaryContent />
        </Suspense>
    );
}