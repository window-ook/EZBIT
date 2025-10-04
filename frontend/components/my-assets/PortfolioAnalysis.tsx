'use client';

import { useContext } from 'react';
import { TickerContext } from '@/providers/TickerProvider';
import { useHoldings } from '@/hooks/supabase/holdings/useHoldings';
import { useUserData } from '@/hooks/supabase/users/useUserData';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcn-ui/card";

const LABEL_STYLE = 'text-xs text-description';

export default function PortfolioAnalysis() {
    const { tickers } = useContext(TickerContext);

    const { holdings } = useHoldings();
    const { user } = useUserData();

    if (!holdings || !user) return (
        <Card
            aria-label='포트폴리오 및 리스크 분석'
            className="w-full p-4">
            <CardTitle className="text-lg font-medium">포트폴리오 현황</CardTitle>
            보유 자산이 없습니다.
        </Card>
    );

    const holdingsCount = holdings.length;

    const holdingsWithValue = holdings.map(h => ({
        market: h.market,
        value: (tickers?.[h.market]?.trade_price ?? 0) * h.total_bid_volume
    }));

    const totalCryptoValue = holdingsWithValue.reduce((sum, h) => sum + h.value, 0);

    const largestHolding = holdingsWithValue.length > 0
        ? holdingsWithValue.reduce((max, curr) => curr.value > max.value ? curr : max)
        : null;

    const largestHoldingRatio = totalCryptoValue > 0 && largestHolding
        ? (largestHolding.value / totalCryptoValue) * 100
        : 0;

    const mostVolatileCoin = holdings.length > 0 && tickers
        ? holdings
            .filter(h => tickers[h.market])
            .map(h => ({
                market: h.market,
                volatility: Math.abs(tickers[h.market].signed_change_rate * 100)
            }))
            .reduce((max, curr) => curr.volatility > max.volatility ? curr : max, { market: '', volatility: 0 })
        : null;

    const totalAssets = (user.holding_krw || 0) + totalCryptoValue;
    const cryptoRatio = totalAssets > 0 ? (totalCryptoValue / totalAssets) * 100 : 0;

    return (
        <Card
            aria-label='포트폴리오 및 리스크 분석'
            className="w-full h-full">
            <CardHeader>
                <CardTitle className="text-lg font-medium">포트폴리오 현황</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                {/* 포트폴리오 다각화 */}
                <section className="border-b pb-3">
                    <h3 className="text-sm font-semibold mb-2 text-gray-700">구성</h3>
                    <dl className="flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                            <dt className={LABEL_STYLE}>보유 종목 수</dt>
                            <dd className="text-sm font-medium font-mono">
                                {holdingsCount}
                            </dd>
                        </div>
                        <div className="flex justify-between items-center">
                            <dt className={LABEL_STYLE}>최대 비중</dt>
                            <dd className="text-sm font-medium">
                                {largestHolding?.market || '-'}
                            </dd>
                        </div>
                        <div className="flex justify-between items-center">
                            <dt></dt>
                            <dd className={`text-sm font-medium font-mono ${largestHoldingRatio > 50 ? 'text-orange-500' : ''}`}>
                                {largestHoldingRatio.toFixed(1)}%
                            </dd>
                        </div>
                    </dl>
                </section>

                {/* 리스크 지표 */}
                <section>
                    <h3 className="text-sm font-semibold mb-2 text-gray-700">리스크</h3>
                    <dl className="flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                            <dt className={LABEL_STYLE}>최대 변동성</dt>
                            <dd className="text-sm font-medium">
                                {mostVolatileCoin?.market || '-'}
                            </dd>
                        </div>
                        <div className="flex justify-between items-center">
                            <dt className={LABEL_STYLE}>전일대비 변동</dt>
                            <dd className={`text-sm font-medium font-mono ${mostVolatileCoin && mostVolatileCoin.volatility > 10 ? 'text-red-500' : ''}`}>
                                {mostVolatileCoin ? `${mostVolatileCoin.volatility.toFixed(2)}%` : '-'}
                            </dd>
                        </div>
                        <div className="flex justify-between items-center">
                            <dt className={LABEL_STYLE}>
                                <div className="text-[10px] text-gray-400 mt-0.5">총 자산 대비</div>
                                <div>암호화폐 비중</div>
                            </dt>
                            <dd className={`text-sm font-medium font-mono ${cryptoRatio > 80 ? 'text-orange-500' : ''}`}>
                                {cryptoRatio.toFixed(1)}%
                            </dd>
                        </div>
                    </dl>
                </section>
            </CardContent>
        </Card>
    );
}