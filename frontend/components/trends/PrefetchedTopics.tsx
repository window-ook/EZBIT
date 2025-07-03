import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { topicsQuery } from '@/queries/trends/topics.query';
import { ITopics } from '@/types/trends/topics';
import { apiClient } from '@/lib/api/apiClient';
import { EXTERNAL_PATHS } from '@/lib/api/paths';
import React from 'react';

const fetchTopics = async () => {
    const data = await apiClient<ITopics>(EXTERNAL_PATHS.TRENDS.TOPICS);
    return data;
};

export default async function PrefetchedTopics({ children }: { children: React.ReactNode }) {
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: topicsQuery.all(),
        queryFn: fetchTopics,
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            {children}
        </HydrationBoundary>
    );
}