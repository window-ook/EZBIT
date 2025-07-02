import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { topicsQuery } from '@/queries/trends/topics.query';
import React from 'react';

const fetchTopics = async () => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/mock/topics.json`);
        const data = await res.json();
        return data;
    } catch {
        return [];
    }
};

const PrefetchTopics = async ({ children }: { children: React.ReactNode }) => {
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
};

export default PrefetchTopics;