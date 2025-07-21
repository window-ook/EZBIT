import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { situationArticlesQuery } from '@/queries/trends/situationArticles.query';
import { fetchSituationArticles } from '@/lib/data/fetchSituationArticles';
import React from 'react';

const TWO_HOURS = 2 * 60 * 60 * 1000;

export default async function PrefetchedSituation({ children }: { children: React.ReactNode }) {
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: situationArticlesQuery.all(),
        queryFn: fetchSituationArticles,
        staleTime: TWO_HOURS,
        gcTime: TWO_HOURS * 2,
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            {children}
        </HydrationBoundary>
    );
}