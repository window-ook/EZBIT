'use client';

import { apiClient } from '@/lib/api/apiClient';
import { INTERNAL_PATHS } from '@/lib/api/paths';
import { situationQuery } from '@/queries/trends/situation.query';
import { ISituation } from '@/types/trends/situation';
import { useSuspenseQuery } from '@tanstack/react-query';

const fetchSituation = async (): Promise<ISituation> => {
    const data = await apiClient<ISituation>(INTERNAL_PATHS.TRENDS.SITUATION);
    return data;
};

/**
 * 토픽 데이터를 조회하는 커스텀 훅
 * @returns React Query useSuspenseQuery 결과 객체
 */
export function useFetchSituation() {
    const { data, isError, error } = useSuspenseQuery({
        queryKey: situationQuery.all(),
        queryFn: fetchSituation,
    });

    return { situation: data, isError, error };
}
