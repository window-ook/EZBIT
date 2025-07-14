"use client";

import { useContext } from 'react';
import { TickerContext } from '@/providers/TickerProvider';
import { useFetchHoldings } from '@/hooks/supabase/useFetchHoldings';
import { useFetchUser } from '@/hooks/supabase/useFetchUser';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcn-ui/card";

const LABEL_STYLE = 'text-xs text-description';

export function HoldingsSummary() {
    const { tickers } = useContext(TickerContext);

    const { user } = useFetchUser();
    const { holdings } = useFetchHoldings();

    // 총 매수 금액 = 각 종목 (total_bid_amount)의 합
    const totalBidAmount = holdings.reduce((acc, curr) => acc + curr.total_bid_amount, 0);

    // 총 평가 금액 = 각 종목 (tickers[market].trade_price * total_bid_volume)의 합
    const totalEvalAmount = holdings.reduce((acc, curr) => acc + (tickers?.[curr.market]?.trade_price ?? 0) * curr.total_bid_volume, 0);

    // 평가손익 = 총 평가 금액 - 총 매수 금액
    const evalProfit = totalEvalAmount - totalBidAmount;

    // 수익률 = ((총 평가 금액 / 총 매수 금액) - 1) * 100
    const yieldRate = totalBidAmount === 0 ? 0 : ((totalEvalAmount / totalBidAmount) - 1) * 100;

    // 총 보유 자산 = 보유 KRW + 총 평가 금액
    const totalAssets = user?.holding_krw || 0 + totalEvalAmount;

    return (
        <section className="w-1/2 h-full flex gap-2 justify-between">
            <Card className="w-full">
                <CardHeader>
                    <div>
                        <CardTitle className="text-lg font-medium">보유 KRW</CardTitle>
                        <div className={LABEL_STYLE}>주문가능 KRW</div>
                    </div>
                    <div className="text-lg font-bold">{user?.holding_krw.toLocaleString()}</div>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-1">
                        <div className={LABEL_STYLE}>총 매수 금액</div>
                        <div className="text-sm font-medium">{totalBidAmount.toLocaleString()}</div>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className={LABEL_STYLE}>총 평가 금액</div>
                        <div className="text-sm font-medium">{totalEvalAmount.toLocaleString()}</div>
                    </div>
                </CardContent>
            </Card>

            <Card className="w-full">
                <CardHeader>
                    <div>
                        <CardTitle className="text-lg font-medium">총 보유 자산</CardTitle>
                        <div className={LABEL_STYLE}>보유 KRW + 총 평가 금액</div>
                    </div>
                    <div className="text-lg font-bold">{totalAssets.toLocaleString()}</div>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-1">
                        <div className={LABEL_STYLE}>평가 손익</div>
                        <div className={`text-sm font-medium ${evalProfit > 0 ? 'text-positive' : evalProfit < 0 ? 'text-negative' : ''}`}>{evalProfit.toLocaleString()}</div>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className={LABEL_STYLE}>수익률</div>
                        <div className={`text-sm font-medium ${yieldRate > 0 ? 'text-positive' : yieldRate < 0 ? 'text-negative' : ''}`}>{yieldRate.toFixed(4)}%</div>
                    </div>
                </CardContent>
            </Card>
        </section>
    );
}