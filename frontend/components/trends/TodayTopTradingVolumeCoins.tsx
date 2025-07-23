'use client';

import { Suspense } from 'react';
import { useTickerBasedTopCoins } from '@/hooks/trends/useTickerBasedTopCoins';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Card } from '@/components/shadcn-ui/card';

const TradingVolumeTopCoinsContent = () => {
    const { tradingVolumeTopCoins, isLoading } = useTickerBasedTopCoins();

    // isLoading이 true일 때 Promise를 throw하여 Suspense 트리거
    if (isLoading) {
        throw new Promise((resolve) => {
            // 다음 렌더링 사이클에서 다시 체크
            const checkInterval = setInterval(() => {
                // 컨텍스트가 업데이트되면 자동으로 재렌더링되므로 일정 시간 후 resolve하여 재시도
                clearInterval(checkInterval);
                resolve(undefined);
            }, 100);
        });
    }

    return (
        <div className="w-full flex flex-col gap-6">
            {tradingVolumeTopCoins?.map(coin => (
                <div
                    key={`${Math.random()}${coin.name}`}
                    className="grid grid-cols-12 gap-4 px-2 items-center"
                >
                    <dl className="col-span-4 text-sm sm:text-base">{coin.name}</dl>
                    <dl className="col-span-4 text-sm sm:text-base text-description">
                        {coin.code}
                    </dl>
                    <dl className={`col-span-4 text-right text-sm sm:text-base ${coin.rate >= 0 ? 'text-positive' : 'text-negative'}`}>
                        {coin.rate >= 0 ? '+' : ''}{coin.rate}%
                    </dl>
                </div>
            ))}
        </div>
    );
};

export default function TodayTopTradingVolumeCoins() {
    return (
        <Card
            aria-label='24시간 거래대금 TOP 5'
            className="w-full h-[315px] p-4 flex-1 flex flex-col gap-6">
            <h2 className="pl-1 text-xl sm:text-2xl font-bold text-main">24시간 거래대금 TOP 5</h2>
            <Suspense fallback={<LoadingSpinner size='2xl' />}>
                <TradingVolumeTopCoinsContent />
            </Suspense>
        </Card>
    );
}
