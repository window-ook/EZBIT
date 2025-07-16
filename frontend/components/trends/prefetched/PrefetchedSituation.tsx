import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { situationQuery } from '@/queries/trends/situation.query';
import { getSituationData } from '@/lib/data/situation';
import React from 'react';

export default async function PrefetchedSituation({ children }: { children: React.ReactNode }) {
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: situationQuery.all(),
        queryFn: getSituationData,
        staleTime: 2 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            {children}
        </HydrationBoundary>
    );
}