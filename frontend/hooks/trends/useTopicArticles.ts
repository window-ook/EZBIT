'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { topicArticlesQuery } from '@/queries/trends/topicArticles.query';
import { ITopicArticles } from '@/types/trends/topicArticles';
import { apiClient } from '@/lib/api/apiClient';
import { INTERNAL_PATHS } from '@/lib/api/paths';

const TWO_HOURS = 2 * 60 * 60 * 1000;

/** 토픽 뉴스 조회 훅
 * @returns {ITopicArticles[]} 토픽 뉴스 목록
 */
export function useTopicArticles() {
    const { data, isError, error } = useSuspenseQuery({
        queryKey: topicArticlesQuery.all(),
        queryFn: () => apiClient<ITopicArticles[]>(INTERNAL_PATHS.topicArticles),
        staleTime: TWO_HOURS,
        gcTime: TWO_HOURS * 2,
    });

    return { topicArticles: data, isError, error };
}