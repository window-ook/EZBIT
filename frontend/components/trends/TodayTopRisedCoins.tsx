'use client';

import { Card } from '@/components/shadcn-ui/card';
import { useTickerBasedTopCoins } from '@/hooks/trends/useTickerBasedTopCoins';

export default function TodayTopRisedCoins() {
    const { todayTopRisedCoins } = useTickerBasedTopCoins();

    return (
        <Card className="w-full h-[580px] p-4 flex-1 flex flex-col gap-6">
            <h2 className="pl-1 text-xl sm:text-2xl font-bold text-main">실시간 상승률 TOP 10</h2>
            <div className="w-full flex flex-col gap-6">
                {todayTopRisedCoins.length > 0 ? (
                    todayTopRisedCoins.map(coin => (
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
                    ))
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-description">
                        실시간 데이터 로딩 중...
                    </div>
                )}
            </div>
        </Card>
    );
}
