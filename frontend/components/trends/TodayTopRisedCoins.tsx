'use client';

import { Suspense } from 'react';
import { useTickerBasedTopCoins } from '@/hooks/trends/useTickerBasedTopCoins';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Card } from '@/components/shadcn-ui/card';

function TodayTopRisedCoinsContent() {
    const { todayTopRisedCoins, isLoading } = useTickerBasedTopCoins();

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
            {todayTopRisedCoins.map(coin => (
                <div
                    key={`${coin.rank}-${coin.code}`}
                    className="grid grid-cols-12 px-2 items-center"
                >
                    <span className="col-span-4">{coin.name}</span>
                    <span className="col-span-4 text-xs lg:text-base text-description">
                        {coin.code}
                    </span>
                    <span className={`col-span-4 text-right ${coin.rate >= 0 ? 'text-positive' : 'text-negative'}`}>
                        {coin.rate >= 0 ? '+' : ''}{coin.rate.toFixed(2)}%
                    </span>
                </div>
            ))}
        </div>
    );
}

export default function TodayTopRisedCoins() {
    return (
        <Card className="w-full h-[580px] p-4 flex-1 flex flex-col gap-6">
            <h2 className="pl-1 text-xl sm:text-2xl font-bold text-main">실시간 상승률 TOP 10</h2>
            <Suspense fallback={<LoadingSpinner size='2xl' />}>
                <TodayTopRisedCoinsContent />
            </Suspense>
        </Card>
    );
}