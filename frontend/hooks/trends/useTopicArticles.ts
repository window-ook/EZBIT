'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { topicsQuery } from '@/queries/trends/topicArticles.query';
import { ITopicArticles } from '@/types/trends/topicArticles';
import { apiClient } from '@/lib/api/apiClient';
import { INTERNAL_PATHS } from '@/lib/api/paths';

const FIVE_MINUTES = 5 * 60 * 1000;

/** 토픽 뉴스 조회 훅
 * @returns {ITopicArticles[]} 토픽 뉴스 목록
 */
export function useTopicArticles() {
    const { data, isError, error } = useSuspenseQuery({
        queryKey: topicsQuery.all(),
        queryFn: () => apiClient<ITopicArticles[]>(INTERNAL_PATHS.topicArticles),
        staleTime: FIVE_MINUTES,
        gcTime: FIVE_MINUTES * 2,
    });

    return { topicArticles: data, isError, error };
}