import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { topicArticlesQuery } from '@/queries/trends/topicArticles.query';
import { fetchTopicsArticles } from '@/lib/data/fetchTopicsArticles';
import React from 'react';

const TWO_HOURS = 2 * 60 * 60 * 1000;

export default async function PrefetchedTopics({ children }: { children: React.ReactNode }) {
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: topicArticlesQuery.all(),
        queryFn: fetchTopicsArticles,
        staleTime: TWO_HOURS,
        gcTime: TWO_HOURS * 2,
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            {children}
        </HydrationBoundary>
    );
}