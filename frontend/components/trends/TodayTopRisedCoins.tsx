'use client';

import { Suspense } from 'react';
import { useTickerBasedTopCoins } from '@/hooks/trends/useTickerBasedTopCoins';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Card } from '@/components/shadcn-ui/card';

function TodayTopRisedCoinsContent() {
    const { todayTopRisedCoins } = useTickerBasedTopCoins();

    return (
        <div className="w-full flex flex-col gap-6" data-testid="top-rised-coins-list">
            {todayTopRisedCoins.map(coin => (
                <div
                    key={`${coin.rank}-${coin.code}`}
                    data-testid={`coin-item-${coin.code}`}
                    aria-label={`${coin.name} ${coin.code} ${coin.rate >= 0 ? '+' : ''}${coin.rate.toFixed(2)}%`}
                    className="grid grid-cols-12 px-2 items-center"
                >
                    <dl className="col-span-4 text-sm sm:text-base font-market-korean">{coin.name}</dl>
                    <dl className="col-span-4 text-sm sm:text-base font-market-code text-description">
                        {coin.code}
                    </dl>
                    <dl className={`col-span-4 text-right text-sm sm:text-base font-percentage ${coin.rate >= 0 ? 'text-positive' : 'text-negative'}`}>
                        {coin.rate >= 0 ? '+' : ''}{coin.rate.toFixed(2)}%
                    </dl>
                </div>
            ))}
        </div>
    );
}

export default function TodayTopRisedCoins() {
    return (
        <Card
            aria-label='실시간 상승률 TOP 10'
            className="w-full h-[580px] p-4 flex-1 flex flex-col gap-6"
        >
            <h2 className="pl-1 text-xl sm:text-2xl font-bold text-main">실시간 상승률 TOP 10</h2>
            <Suspense fallback={<LoadingSpinner size='2xl' />}>
                <TodayTopRisedCoinsContent />
            </Suspense>
        </Card>
    );
}