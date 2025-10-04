'use server';

import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { holdingsQuery } from '@/queries/supabase/holdings.query';
import { userQuery } from '@/queries/supabase/users.query';
import { getHoldings } from '@/actions/supabase/holdings';
import { getUserData } from '@/actions/supabase/users';
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
                gcTime: 30 * 60 * 1000 * 2,
                refetchOnReconnect: 'always',
                refetchOnWindowFocus: false,
            },
        },
    });

    const prefetchPromises = [
        queryClient.prefetchQuery({
            queryKey: userQuery.all(),
            queryFn: async () => {
                const result = await getUserData();
                if (!result.success) throw new Error(result.message);
                return result.data ?? [];
            },
        }),
        queryClient.prefetchQuery({
            queryKey: holdingsQuery.all(),
            queryFn: async () => {
                const result = await getHoldings();
                if (!result.success) throw new Error(result.message);
                return result.data ?? [];
            },
        })
    ];

    await Promise.all(prefetchPromises);

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            {children}
        </HydrationBoundary>
    );
}