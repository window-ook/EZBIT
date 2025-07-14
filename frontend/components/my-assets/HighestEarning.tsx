'use client';

import { useContext } from 'react';
import { TickerContext } from '@/providers/TickerProvider';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcn-ui/card";
import { useFetchHoldings } from '@/hooks/supabase/useFetchHoldings';

export default function HighestEarning() {
    const { tickers } = useContext(TickerContext);

    const { holdings } = useFetchHoldings();

    // 종목별 수익률 계산
    const earnings = holdings
        .filter(h => h.total_bid_amount > 0 && tickers?.[h.market]?.trade_price)
        .map(h => {
            const evalAmount = (tickers?.[h.market]?.trade_price ?? 0) * h.total_bid_volume; // 평가금액
            const yieldRate = ((evalAmount / h.total_bid_amount) - 1) * 100; // 수익률
            return {
                market: h.market,
                yieldRate,
            };
        });

    // 최고 수익률 종목 찾기
    const highestEarning = earnings.reduce((max, curr) => (curr.yieldRate > max.yieldRate ? curr : max), { market: '-', yieldRate: 0 });

    return (
        <Card className="w-full h-full">
            <CardHeader>
                <CardTitle className="text-lg font-medium">최고 수익률 코인</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col h-full">
                <span className="text-lg font-semibold">{highestEarning.market}</span>
                <span className="text-xl text-red-500">{highestEarning.yieldRate.toFixed(4)}%</span>
            </CardContent>
        </Card>
    );
}