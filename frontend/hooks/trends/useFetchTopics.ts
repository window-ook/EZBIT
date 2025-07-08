'use client';

import { getTopics } from '@/actions/trends/getTopics';
import { topicsQuery } from '@/queries/trends/topics.query';
import { useSuspenseQuery } from '@tanstack/react-query';

/**
 * 토픽 데이터를 조회하는 커스텀 훅
 * @returns React Query useSuspenseQuery 결과 객체
 */
export function useFetchTopics() {
    const { data, isError, error } = useSuspenseQuery({
        queryKey: topicsQuery.all(),
        queryFn: () => getTopics(),
    });

    return { topics: data, isError, error };
}