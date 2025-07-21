'use client';

import { useTickerBasedTopCoins } from '@/hooks/trends/useTickerBasedTopCoins';
import { Card } from '@/components/shadcn-ui/card';

export default function DailyTopBidCoins() {
    const { tradingVolumeTopCoins } = useTickerBasedTopCoins();

    return (
        <Card className="w-full h-[315px] p-4 flex-1 flex flex-col gap-6">
            <h2 className="pl-1 text-xl sm:text-2xl font-bold text-main">24시간 거래대금 TOP 5</h2>
            <div className="w-full flex flex-col gap-6">
                {tradingVolumeTopCoins?.map(coin => (
                    <div
                        key={`${Math.random()}${coin.name}`}
                        className="grid grid-cols-12 gap-4 px-2 items-center"
                    >
                        <span className="col-span-4">{coin.name}</span>
                        <span className="col-span-4 text-xs lg:text-base text-description">
                            {coin.code}
                        </span>
                        <span className={`col-span-4 text-right ${coin.rate >= 0 ? 'text-positive' : 'text-negative'}`}>
                            {coin.rate >= 0 ? '+' : ''}{coin.rate}%
                        </span>
                    </div>
                ))}
            </div>
        </Card>
    );
}
