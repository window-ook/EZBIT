import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { fetchDailyTopBidCoins } from '@/lib/data/fetchDailyTopBidCoins';
import { dailyTopBidCoinsQuery } from '@/queries/trends/dailyTopBidCoins.query';
import React from 'react';

const SIX_HOURS = 6 * 60 * 60 * 1000;

export default async function PrefetchedDailyTopBidCoins({ children }: { children: React.ReactNode }) {
    const queryClient = new QueryClient();

    try {
        await queryClient.prefetchQuery({
            queryKey: dailyTopBidCoinsQuery.all(),
            queryFn: fetchDailyTopBidCoins,
            staleTime: SIX_HOURS,
            gcTime: SIX_HOURS * 2,
        });
    } catch (error) {
        console.error('일 매수 체결강도 prefetch 실패:', error);
        queryClient.setQueryData(dailyTopBidCoinsQuery.all(), []);
    }

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            {children}
        </HydrationBoundary>
    );
}
