'use client';

import { getSituation } from '@/actions/trends/getSituation';
import { situationQuery } from '@/queries/trends/situation.query';
import { useSuspenseQuery } from '@tanstack/react-query';

/**
 * 토픽 데이터를 조회하는 커스텀 훅
 * @returns React Query useSuspenseQuery 결과 객체
 */
export function useFetchSituation() {
    const { data, isError, error } = useSuspenseQuery({
        queryKey: situationQuery.all(),
        queryFn: () => getSituation(),
    });

    return { situation: data, isError, error };
}
