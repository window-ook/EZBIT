import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { fetchMarketCapTopCoins } from '@/lib/data/fetchMarketCapTopCoins';
import { marketCapTopCoinsQuery } from '@/queries/trends/marketCapTopCoins.query';
import React from 'react';

export default async function PrefetchedMarketCapTopCoins({ children }: { children: React.ReactNode }) {
    const queryClient = new QueryClient();

    try {
        await queryClient.prefetchQuery({
            queryKey: marketCapTopCoinsQuery.all(),
            queryFn: fetchMarketCapTopCoins,
            staleTime: 5 * 60 * 1000,
            gcTime: 20 * 60 * 1000,
        });
    } catch (error) {
        console.error('시가총액 TOP 코인 prefetch 실패:', error);
        // 실패 시 빈 데이터로 초기화
        queryClient.setQueryData(marketCapTopCoinsQuery.all(), []);
    }

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            {children}
        </HydrationBoundary>
    );
}