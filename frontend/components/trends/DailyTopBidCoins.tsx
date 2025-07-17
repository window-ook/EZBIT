'use client';

import { useFetchDailyTopBidCoins } from '@/hooks/trends/useFetchDailyTopBidCoins';
import { Card } from '@/components/shadcn-ui/card';

export default function DailyTopBidCoins() {
    const { dailyBidData } = useFetchDailyTopBidCoins();

    return (
        <Card className="w-full h-[315px] p-4 flex flex-col gap-4">
            <h2 className="mb-2 text-xl sm:text-2xl font-bold text-main">일 매수 체결강도 TOP 5</h2>
            <div className="w-full flex flex-col gap-4">
                <div className="w-full flex flex-col gap-4">
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
            </div>
        </Card>
    );
}
