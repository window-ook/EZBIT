'use server';

import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { getHoldings } from '@/actions/supabase/holdings';
import { getUserData } from '@/actions/supabase/users';
import { holdingsQuery } from '@/queries/supabase/holdings.query';
import { userQuery } from '@/queries/supabase/users.query';
import { AUTH_ERROR } from '@/utils/constants/messages';
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
                if (!result) throw new Error(AUTH_ERROR.LOGIN_REQUIRED);
                return result ?? [];
            },
        }),
        queryClient.prefetchQuery({
            queryKey: holdingsQuery.all(),
            queryFn: async () => {
                const result = await getHoldings();
                if (!result) throw new Error(AUTH_ERROR.LOGIN_REQUIRED);
                return result ?? [];
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