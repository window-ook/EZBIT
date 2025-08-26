import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { situationArticlesQuery } from '@/queries/trends/situationArticles.query';
import { fetchSituationArticles } from '@/lib/data/fetchSituationArticles';
import React from 'react';

export default async function PrefetchedSituation({ children }: { children: React.ReactNode }) {
    const queryClient = new QueryClient();

    try {
        await queryClient.prefetchQuery({
            queryKey: situationArticlesQuery.all(),
            queryFn: fetchSituationArticles,
        });
    } catch (error) {
        console.error('❌ 시황 뉴스 프리페치 실패:', error);
    }

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            {children}
        </HydrationBoundary>
    );
}