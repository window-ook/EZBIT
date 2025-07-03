import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { situationQuery } from '@/queries/trends/situation.query';
import { ISituation } from "@/types/trends/situation";
import { apiClient } from '@/lib/api/apiClient';
import { EXTERNAL_PATHS } from '@/lib/api/paths';
import React from 'react';

const fetchSituation = async (): Promise<ISituation> => {
    const data = await apiClient<ISituation>(EXTERNAL_PATHS.TRENDS.SITUATION);
    return data;
};

export default async function PrefetchedSituation({ children }: { children: React.ReactNode }) {
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: situationQuery.all(),
        queryFn: fetchSituation,
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            {children}
        </HydrationBoundary>
    );
}

