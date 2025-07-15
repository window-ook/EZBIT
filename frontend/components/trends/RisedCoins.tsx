'use client';

import { useState } from 'react';
import { useFetchRisedCoins } from '@/hooks/trends/useFetchRisedCoins';
import { Card } from '@/components/shadcn-ui/card';

const PERIODS = [
    { label: '1개월', value: 'oneMonth' },
    { label: '3개월', value: 'threeMonths' },
    { label: '6개월', value: 'sixMonths' },
];

export default function RisedCoins() {
    const [selectedPeriod, setSelectedPeriod] = useState<'oneMonth' | 'threeMonths' | 'sixMonths'>('oneMonth');

    const { topRisedCoins } = useFetchRisedCoins();

    const sortedCoins = () => {
        return [...topRisedCoins]
            .filter(coin => !!coin.periods[selectedPeriod] && coin.periods[selectedPeriod] !== '-')
            .sort((a, b) => {
                const aValue = parseFloat(a.periods[selectedPeriod].replace('%', ''));
                const bValue = parseFloat(b.periods[selectedPeriod].replace('%', ''));
                return bValue - aValue;
            })
            .slice(0, 5);
    };

    return (
        <Card className="w-full p-4 flex flex-col gap-4">
            <h2 className="mb-2 text-xl sm:text-2xl font-bold text-main">기간별 상승률 TOP 5</h2>

            <div className="w-full flex flex-col gap-4 mb-4">
                {/* 기간 선택 셀렉터(sm 초과) */}
                <div className="hidden sm:flex gap-2 rounded-lg">
                    {PERIODS?.map(period => (
                        <button
                            key={period.value}
                            onClick={() => setSelectedPeriod(period.value as 'oneMonth' | 'threeMonths' | 'sixMonths')}
                            className={`px-4 py-2 rounded-md text-xs sm:text-base cursor-pointer     transition-all duration-200 ${selectedPeriod === period.value
                                ? 'bg-main text-white font-medium shadow-xs'
                                : 'bg-white text-subtitle border border-slate-200 hover:bg-slate-100'
                                }`}
                        >
                            {period.label}
                        </button>
                    ))}
                </div>

                {/* 기간 선택 셀렉터(sm 이하) */}
                <div className="block sm:hidden w-full">
                    <select
                        value={selectedPeriod}
                        onChange={e => setSelectedPeriod(e.target.value as 'oneMonth' | 'threeMonths' | 'sixMonths')}
                        className="w-full px-4 py-2 rounded-md text-sm bg-white border border-slate-200"
                    >
                        {PERIODS.map(period => (
                            <option key={period.value} value={period.value}>
                                {period.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="w-full flex flex-col gap-6">
                    <div className="grid grid-cols-12 gap-4 px-2 border-dashed border-2 border-main-light bg-white text-subtitle text-sm sm:text-base text-center">
                        <div className="col-span-4">자산</div>
                        <div className="col-span-4">마켓</div>
                        <div className="col-span-4">상승률</div>
                    </div>

                    {sortedCoins().map(coin => (
                        <div
                            key={coin.name}
                            className="grid grid-cols-12 gap-4 px-2 items-center"
                        >
                            <span className="col-span-4">{coin.name}</span>
                            <span className="col-span-4 text-xs lg:text-base text-description">
                                {coin.code}
                            </span>
                            <span className="col-span-4 text-positive text-right">
                                {coin.periods[selectedPeriod]}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    );
}
