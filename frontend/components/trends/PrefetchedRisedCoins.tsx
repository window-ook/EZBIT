import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { risedCoinsQuery } from '@/queries/trends/risedCoins.query';
import { apiClient } from '@/lib/api/apiClient';
import { EXTERNAL_PATHS } from '@/lib/api/paths';
import { IRisedCoin } from '@/types/trends/risedCoins';
import React from 'react';

const fetchRisedCoins = async () => {
    const data = await apiClient<IRisedCoin[]>(EXTERNAL_PATHS.TRENDS.RISED_COINS);
    return data;
};

export default async function PrefetchedRisedCoins({ children }: { children: React.ReactNode }) {
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
}