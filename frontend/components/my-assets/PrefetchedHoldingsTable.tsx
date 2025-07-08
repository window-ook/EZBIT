import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { holdingsQuery } from '@/queries/supabase/holdings.query';
import { getHoldings } from '@/actions/supabase/getHoldings';
import React from 'react';

export default async function PrefetchedHoldingsTable({ children }: { children: React.ReactNode }) {
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: holdingsQuery.all(),
        queryFn: getHoldings,
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            {children}
        </HydrationBoundary>
    );
}