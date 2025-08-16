'use client';

import { useContext } from 'react';
import { TickerContext } from '@/providers/TickerProvider';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcn-ui/card";
import { useHoldings } from '@/hooks/supabase/holdings/useHoldings';

export default function HighestEarning() {
    const { tickers } = useContext(TickerContext);

    const { holdings } = useHoldings();

    const earnings = holdings
        .filter(item => item.total_bid_amount > 0 && tickers?.[item.market]?.trade_price)
        .map(item => {
            const evalAmount = tickers?.[item.market]?.trade_price * item.total_bid_volume; // 평가금액
            const yieldRate = ((evalAmount / item.total_bid_amount) - 1) * 100; // 수익률
            return {
                market: item.market,
                yieldRate,
            };
        });

    const highestEarning = earnings.length
        ? earnings.reduce((max, curr) => (curr.yieldRate > max.yieldRate ? curr : max))
        : null;

    return (
        <Card
            aria-label='현재 최고 수익률 코인'
            className="w-full h-full">
            <CardHeader>
                <CardTitle className="text-lg font-medium">현재 최고 수익률</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col h-full gap-2">
                <div className="text-lg font-medium min-w-[4rem]">
                    <div className="overflow-hidden text-ellipsis">
                        {highestEarning?.market ? highestEarning.market : '-'}
                    </div>
                </div>
                <div className={`text-xl font-bold font-mono tracking-tight min-w-[5rem] ${highestEarning?.yieldRate && highestEarning.yieldRate > 0 ? 'text-positive' : 'text-negative'}`}>
                    <div className="overflow-hidden text-ellipsis">
                        {highestEarning?.yieldRate ? highestEarning.yieldRate.toFixed(4) + '%' : ''}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}