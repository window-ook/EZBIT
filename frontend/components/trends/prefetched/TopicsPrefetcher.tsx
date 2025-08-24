import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { topicArticlesQuery } from '@/queries/trends/topicArticles.query';
import { fetchTopicsArticles } from '@/lib/data/fetchTopicsArticles';
import React from 'react';

export default async function PrefetchedTopics({ children }: { children: React.ReactNode }) {
    const queryClient = new QueryClient();

    try {
        await queryClient.prefetchQuery({
            queryKey: topicArticlesQuery.all(),
            queryFn: fetchTopicsArticles,
        });
    } catch (error) {
        console.error('❌ 토픽 뉴스 프리페치 실패:', error);
    }

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            {children}
        </HydrationBoundary>
    );
}