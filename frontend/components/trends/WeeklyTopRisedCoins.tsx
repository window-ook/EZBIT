'use client';

import { useWeeklyTopRisedCoins } from '@/hooks/trends/useWeeklyTopRisedCoins';
import { Card } from '@/components/shadcn-ui/card';

export default function WeeklyTopRisedCoins() {
    const { weeklyTopCoins } = useWeeklyTopRisedCoins();

    return (
        <Card className="w-full h-[580px] p-4 flex-1 flex flex-col gap-6">
            <h2 className="pl-1 text-xl sm:text-2xl font-bold text-main">주간 상승률 TOP 10</h2>
            <div className="w-full flex flex-col gap-6">
                {weeklyTopCoins?.map(coin => (
                    <div
                        key={`${Math.random()}${coin.name}`}
                        className="grid grid-cols-12 px-2 items-center"
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
