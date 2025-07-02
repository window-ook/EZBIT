import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { risedCoinsQuery } from '@/queries/trends/risedCoins.query';
import React from 'react';

const fetchRisedCoins = async () => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/mock/rised_coins.json`);
        const data = await res.json();
        return data;
    } catch {
        return [];
    }
};

const PrefetchRisedCoins = async ({ children }: { children: React.ReactNode }) => {
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: risedCoinsQuery.all(),
        queryFn: fetchRisedCoins,
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            {children}
        </HydrationBoundary>
    );
};

export default PrefetchRisedCoins;