'use client';

import { useDailyTopBidCoins } from '@/hooks/trends/useDailyTopBidCoins';
import { Card } from '@/components/shadcn-ui/card';

export default function DailyTopBidCoins() {
    const { dailyBidData } = useDailyTopBidCoins();

    return (
        <Card className="w-full h-[315px] p-4 flex-1 flex flex-col gap-6">
            <h2 className="pl-1 text-xl sm:text-2xl font-bold text-main">일 매수 체결강도 TOP 5</h2>
            <div className="w-full flex flex-col gap-6">
                {dailyBidData?.map(coin => (
                    <div
                        key={`${Math.random()}${coin.name}`}
                        className="grid grid-cols-12 gap-4 px-2 items-center"
                    >
                        <span className="col-span-4">{coin.name}</span>
                        <span className="col-span-4 text-xs lg:text-base text-description">
                            {coin.code}
                        </span>
                        <span className="col-span-4 text-positive text-right">
                            +{coin.rate}%
                        </span>
                    </div>
                ))}
            </div>
        </Card>
    );
}
