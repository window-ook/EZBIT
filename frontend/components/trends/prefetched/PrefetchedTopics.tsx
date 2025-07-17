import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { topicArticlesQuery } from '@/queries/trends/topicArticles.query';
import { fetchTopicsArticles } from '@/lib/data/fetchTopicsArticles';
import React from 'react';

export default async function PrefetchedTopics({ children }: { children: React.ReactNode }) {
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: topicArticlesQuery.all(),
        queryFn: fetchTopicsArticles,
        staleTime: 2 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            {children}
        </HydrationBoundary>
    );
}