'use client';

import { Card } from '@/components/shadcn-ui/card';
import { useFetchWeeklyTopCoins } from '@/hooks/trends/useFetchWeeklyTopCoins';

export default function WeeklyTopRisedCoins() {
    const { weeklyTopCoins } = useFetchWeeklyTopCoins();

    return (
        <Card className="w-full p-4 flex flex-col gap-4">
            <h2 className="mb-2 text-xl sm:text-2xl font-bold text-main">주간 상승률 TOP 10</h2>

            <div className="w-full flex flex-col gap-4 mb-4">
                <div className="w-full flex flex-col gap-6">
                    {weeklyTopCoins?.map(coin => (
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
