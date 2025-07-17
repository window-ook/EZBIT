'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { situationQuery } from '@/queries/trends/situation.query';
import { ISituation } from '@/types/trends/situation';
import { apiClient } from '@/lib/api/apiClient';

const SIX_HOURS = 6 * 60 * 60 * 1000;

/**
 * 시황 조회 훅
 * @returns {ISituation[]} 시황 목록
 */
export function useFetchSituationArticles() {
    const { data, isError, error } = useSuspenseQuery({
        queryKey: situationQuery.all(),
        queryFn: () => apiClient<ISituation[]>('/api/situation'),
        staleTime: SIX_HOURS,
        gcTime: SIX_HOURS * 2,
    });

    return { situationArticles: data, isError, error };
}