import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { topicsQuery } from '@/queries/trends/topics.query';
import { getTopicsData } from '@/lib/data/topics';
import React from 'react';

export default async function PrefetchedTopics({ children }: { children: React.ReactNode }) {
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: topicsQuery.all(),
        queryFn: getTopicsData,
        staleTime: 2 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            {children}
        </HydrationBoundary>
    );
}