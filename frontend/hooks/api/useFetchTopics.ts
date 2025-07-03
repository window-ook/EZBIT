'use client';

import { apiClient } from '@/lib/api/apiClient';
import { INTERNAL_PATHS } from '@/lib/api/paths';
import { topicsQuery } from '@/queries/trends/topics.query';
import { ITopics } from '@/types/trends/topics';
import { useSuspenseQuery } from '@tanstack/react-query';

const fetchTopics = async (): Promise<ITopics> => {
    const data = await apiClient<ITopics>(INTERNAL_PATHS.TRENDS.TOPICS);
    return data;
};

/**
 * 토픽 데이터를 조회하는 커스텀 훅
 * @returns React Query useSuspenseQuery 결과 객체
 */
export function useFetchTopics() {
    const { data, isError, error } = useSuspenseQuery({
        queryKey: topicsQuery.all(),
        queryFn: fetchTopics,
    });

    return { topics: data, isError, error };
}