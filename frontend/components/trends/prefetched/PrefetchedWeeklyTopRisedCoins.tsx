import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { fetchWeeklyTopRisedCoins } from '@/lib/data/fetchWeeklyTopRisedCoins';
import { weeklyTopRisedCoinsQuery } from '@/queries/trends/weeklyTopRisedCoins.query';
import React from 'react';

export default async function PrefetchedWeeklyTopRisedCoins({ children }: { children: React.ReactNode }) {
    const queryClient = new QueryClient();

    try {
        await queryClient.prefetchQuery({
            queryKey: weeklyTopRisedCoinsQuery.all(),
            queryFn: fetchWeeklyTopRisedCoins,
            staleTime: 5 * 60 * 1000,
            gcTime: 20 * 60 * 1000,
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