import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { fetchDailyTopBidCoins } from '@/lib/data/fetchDailyTopBidCoins';
import { dailyTopBidCoinsQuery } from '@/queries/trends/dailyTopBidCoins.query';
import React from 'react';

export default async function PrefetchedDailyTopBidCoins({ children }: { children: React.ReactNode }) {
    const queryClient = new QueryClient();

    try {
        await queryClient.prefetchQuery({
            queryKey: dailyTopBidCoinsQuery.all(),
            queryFn: fetchDailyTopBidCoins,
            staleTime: 3 * 60 * 1000,
            gcTime: 12 * 60 * 1000,
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
