'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { situationArticlesQuery } from '@/queries/trends/situationArticles.query';
import { apiClient } from '@/lib/api/apiClient';
import { INTERNAL_PATHS } from '@/lib/api/paths';
import { ISituationArticles } from '@/types/trends/situationArticles';


/** 시황 조회 훅
 * @returns {ISituationArticles[]} 시황 목록
 */
export function useSituationArticles() {
    const { data, isError, error } = useSuspenseQuery({
        queryKey: situationArticlesQuery.all(),
        queryFn: () => apiClient<ISituationArticles[]>(INTERNAL_PATHS.TRENDS.SITUATION_ARTICLES),
    });

    return { situationArticles: data, isError, error };
}