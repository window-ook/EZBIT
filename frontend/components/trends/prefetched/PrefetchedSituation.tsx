import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { situationArticlesQuery } from '@/queries/trends/situationArticles.query';
import { fetchSituationArticles } from '@/lib/data/fetchSituationArticles';
import React from 'react';

export default async function PrefetchedSituation({ children }: { children: React.ReactNode }) {
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: situationArticlesQuery.all(),
        queryFn: fetchSituationArticles,
        staleTime: 2 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            {children}
        </HydrationBoundary>
    );
}