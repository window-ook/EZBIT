'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { topicsQuery } from '@/queries/trends/topics.query';
import { ITopic } from '@/types/trends/topics';
import { apiClient } from '@/lib/api/apiClient';

const FIVE_MINUTES = 5 * 60 * 1000;

export function useFetchTopicArticles() {
    const { data, isError, error } = useSuspenseQuery({
        queryKey: topicsQuery.all(),
        queryFn: () => apiClient<ITopic[]>('/api/topics'),
        staleTime: FIVE_MINUTES,
        gcTime: FIVE_MINUTES * 2,
    });

    return { topicArticles: data, isError, error };
}
