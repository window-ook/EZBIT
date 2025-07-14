'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { holdingsQuery } from '@/queries/supabase/holdings.query';
import { getHoldings } from '@/actions/supabase/getHoldings';

/**
 * 보유 자산을 조회하는 커스텀 훅
 * @queryFn getHoldings: 보유 자산 조회 서버 액션
 * @returns {data, isError, error}
 */
export function useFetchHoldings() {
    const { data, isError, error } = useSuspenseQuery({
        queryKey: holdingsQuery.all(),
        queryFn: () => getHoldings(),
    });

    return { holdings: data, isError, error };
}