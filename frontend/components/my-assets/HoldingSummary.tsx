"use client";

import { useContext } from 'react';
import { TickerContext } from '@/providers/TickerProvider';
import { useHoldings } from '@/hooks/supabase/useHoldings';
import { useUserData } from '@/hooks/supabase/useUserData';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcn-ui/card";

const LABEL_STYLE = 'text-xs text-description';

export default function HoldingsSummary() {
    const { tickers } = useContext(TickerContext);

    const { user } = useUserData();
    const { holdings } = useHoldings();

    // 총 매수 금액 = 각 종목 (total_bid_amount)의 합
    const totalBidAmount = holdings.reduce((acc, curr) => acc + curr.total_bid_amount, 0);

    // 총 평가 금액 = 각 종목 (tickers[market].trade_price * total_bid_volume)의 합
    const totalEvalAmount = holdings.reduce((acc, curr) => acc + (tickers?.[curr.market]?.trade_price ?? 0) * curr.total_bid_volume, 0);

    // 평가손익 = 총 평가 금액 - 총 매수 금액
    const evalProfit = totalEvalAmount - totalBidAmount;

    // 수익률 = ((총 평가 금액 / 총 매수 금액) - 1) * 100
    const yieldRate = totalBidAmount === 0 ? 0 : ((totalEvalAmount / totalBidAmount) - 1) * 100;

    // 총 보유 자산 = 보유 KRW + 총 평가 금액
    const totalAssets = (user?.holding_krw || 0) + totalEvalAmount;

    return (
        <section className="w-1/2 h-full flex gap-2 justify-between">
            <Card
                aria-label='보유 원화, 총 매수금, 총 평가금'
                className="w-full">
                <CardHeader>
                    <dl className="flex flex-col">
                        <CardTitle className="text-lg font-medium">보유 KRW</CardTitle>
                        <dt className={LABEL_STYLE}>주문가능 KRW</dt>
                    </dl>
                    <div className="text-lg font-bold">{user?.holding_krw.toLocaleString()}</div>
                </CardHeader>
                <CardContent>
                    <dl className="flex justify-between">
                        <dt className={LABEL_STYLE}>총 매수 금액</dt>
                        <dd className="text-sm font-medium">{totalBidAmount.toLocaleString()}</dd>
                    </dl>
                    <dl className="flex justify-between">
                        <dt className={LABEL_STYLE}>총 평가 금액</dt>
                        <dd className="text-sm font-medium">{parseFloat(totalEvalAmount.toFixed(0)).toLocaleString()}</dd>
                    </dl>
                </CardContent>
            </Card>

            <Card
                aria-label='총 보유 자산, 평가 손익, 수익률'
                className="w-full">
                <CardHeader>
                    <dl className="flex flex-col">
                        <CardTitle className="text-lg font-medium">총 보유 자산</CardTitle>
                        <dt className={LABEL_STYLE}>보유 KRW + 총 평가 금액</dt>
                    </dl>
                    <div className="text-lg font-bold">{parseFloat(totalAssets.toFixed(4)).toLocaleString()}</div>
                </CardHeader>
                <CardContent>
                    <dl className="flex justify-between">
                        <dt className={LABEL_STYLE}>평가 손익</dt>
                        <dd className={`text-sm font-medium ${evalProfit > 0 ? 'text-positive' : evalProfit < 0 ? 'text-negative' : ''}`}>{evalProfit.toLocaleString()}</dd>
                    </dl>
                    <dl className="flex justify-between">
                        <dt className={LABEL_STYLE}>수익률</dt>
                        <dd className={`text-sm font-medium ${yieldRate > 0 ? 'text-positive' : yieldRate < 0 ? 'text-negative' : ''}`}>{yieldRate.toFixed(4)}%</dd>
                    </dl>
                </CardContent>
            </Card>
        </section>
    );
}