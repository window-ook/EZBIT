'use client';

import { useQuery } from '@tanstack/react-query';
import { topicsQuery } from '@/queries/trends/topics.query';
import { getTopics } from '@/actions/trends/getTopics';

const SIX_HOURS = 6 * 60 * 60 * 1000;

export function useFetchTopicArticles() {
    const { data, isLoading, isError, error } = useQuery({
        queryKey: topicsQuery.all(),
        queryFn: getTopics,
        staleTime: SIX_HOURS,
        gcTime: SIX_HOURS * 2,
        retry: 2,
        retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    });

    return { topicArticles: { data, isLoading, isError, error } };
}