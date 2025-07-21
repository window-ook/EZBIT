import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { fetchWeeklyTopRisedCoins } from '@/lib/data/fetchWeeklyTopRisedCoins';
import { weeklyTopRisedCoinsQuery } from '@/queries/trends/weeklyTopRisedCoins.query';
import React from 'react';

const SIX_HOURS = 6 * 60 * 60 * 1000;

export default async function PrefetchedWeeklyTopRisedCoins({ children }: { children: React.ReactNode }) {
    const queryClient = new QueryClient();

    try {
        await queryClient.prefetchQuery({
            queryKey: weeklyTopRisedCoinsQuery.all(),
            queryFn: fetchWeeklyTopRisedCoins,
            staleTime: SIX_HOURS,
            gcTime: SIX_HOURS * 2,
        });
    } catch (error) {
        console.error('주간 상승률 prefetch 실패:', error);
        // 실패 시 빈 데이터로 초기화
        queryClient.setQueryData(weeklyTopRisedCoinsQuery.all(), []);
    }

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            {children}
        </HydrationBoundary>
    );
}