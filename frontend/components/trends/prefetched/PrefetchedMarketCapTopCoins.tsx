import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { fetchMarketCapTopCoins } from '@/lib/data/fetchMarketCapTopCoins';
import { marketCapTopCoinsQuery } from '@/queries/trends/marketCapTopCoins.query';
import React from 'react';

const SIX_HOURS = 6 * 60 * 60 * 1000;

export default async function PrefetchedMarketCapTopCoins({ children }: { children: React.ReactNode }) {
    const queryClient = new QueryClient();

    try {
        await queryClient.prefetchQuery({
            queryKey: marketCapTopCoinsQuery.all(),
            queryFn: fetchMarketCapTopCoins,
            staleTime: SIX_HOURS,
            gcTime: SIX_HOURS * 2,
        });
    } catch (error) {
        console.error('시가총액 TOP 5 prefetch 실패:', error);
        queryClient.setQueryData(marketCapTopCoinsQuery.all(), []);
    }

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            {children}
        </HydrationBoundary>
    );
} 