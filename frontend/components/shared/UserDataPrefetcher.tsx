import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { userQuery } from '@/queries/supabase/user.query';
import { holdingsQuery } from '@/queries/supabase/holdings.query';
import { fetchUserDataForPrefetch } from '@/lib/data/fetchUserDataForPrefetch';
import { fetchHoldingsForPrefetch } from '@/lib/data/fetchHoldingsForPrefetch';
import React from 'react';

export default async function UserDataPrefetcher({
    children,
}: {
    children: React.ReactNode;
}) {
    const queryClient = new QueryClient();

    try {
        const prefetchPromises = [
            queryClient.prefetchQuery({
                queryKey: userQuery.all(),
                queryFn: fetchUserDataForPrefetch,
                staleTime: 5 * 60 * 1000,
                gcTime: 10 * 60 * 1000
            }),
            queryClient.prefetchQuery({
                queryKey: holdingsQuery.all(),
                queryFn: fetchHoldingsForPrefetch,
                staleTime: 5 * 60 * 1000,
                gcTime: 10 * 60 * 1000
            })
        ];

        await Promise.all(prefetchPromises);
    } catch (error) {
        console.error('❌ 유저, 보유 자산 프리페치 실패:', error);
    }

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            {children}
        </HydrationBoundary>
    );
}