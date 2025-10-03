'use server';

import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { fetchHoldingsForPrefetch } from '@/lib/data/fetchHoldingsForPrefetch';
import { holdingsQuery } from '@/queries/supabase/holdings.query';
import { userQuery } from '@/queries/supabase/users.query';
import { fetchUserDataForPrefetch } from '@/lib/data/fetchUserDataForPrefetch';
import React from 'react';

export default async function PrefetchedHoldingsAndUserData({ children }: { children: React.ReactNode; }) {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: (failureCount, error) => {
                    if (error?.name === 'NetworkError') return failureCount < 3;
                    return false;
                },
                staleTime: 30 * 60 * 1000,
                gcTime: 60 * 60 * 1000,
                refetchOnReconnect: 'always',
                refetchOnWindowFocus: false,
            },
        },
    });

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
        console.error('프리페치 실패:', error);
    }

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            {children}
        </HydrationBoundary>
    );
}