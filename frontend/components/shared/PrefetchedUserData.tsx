import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { userQuery } from '@/queries/supabase/user.query';
import { holdingsQuery } from '@/queries/supabase/holdings.query';
import { fetchUserDataForPrefetch } from '@/lib/data/fetchUserDataForPrefetch';
import { fetchHoldingsForPrefetch } from '@/lib/data/fetchHoldingsForPrefetch';
import React from 'react';

export default async function PrefetchedUserData({
    children,
}: {
    children: React.ReactNode;
}) {
    const queryClient = new QueryClient();

    try {
        const prefetchPromises = [
            // 기본 사용자 데이터 Prefetch 전용 함수 사용
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
        console.error('❌ 데이터 프리페치 전체 실패:', error);
    }

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            {children}
        </HydrationBoundary>
    );
}