'use client';

import { useContext } from 'react';
import { TickerContext } from '@/providers/TickerProvider';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcn-ui/card";
import { useHoldings } from '@/hooks/supabase/useHoldings';

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

    const highestEarning = earnings.reduce((max, curr) => (curr.yieldRate > max.yieldRate ? curr : max));

    return (
        <Card className="w-full h-full">
            <CardHeader>
                <CardTitle className="text-lg font-medium">현재 최고 수익률</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col h-full">
                <span className="text-lg font-semibold">{highestEarning?.market}</span>
                <span className={`text-xl ${highestEarning.yieldRate > 0 ? 'text-positive' : 'text-negative'}`}>{highestEarning?.yieldRate?.toFixed(4)}%</span>
            </CardContent>
        </Card>
    );
}