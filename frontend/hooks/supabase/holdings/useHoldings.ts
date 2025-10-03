'use client';

import { useQuery } from '@tanstack/react-query';
import { holdingsQuery } from '@/queries/supabase/holdings.query';
import { getHoldings } from '@/actions/supabase/holdings/getHoldings';

/**
 * 보유 자산을 조회하는 훅
 * @description 로그인 상태에 따라 조건부로 실행
 * @param enabled - 쿼리 활성화 여부 (조건부 실행)
 * @returns {holdings, isPending, isError, error}
 */
export function useHoldings(enabled: boolean = true) {
    const { data, isPending, isError, error } = useQuery({
        queryKey: holdingsQuery.all(),
        queryFn: async () => {
            const result = await getHoldings();
            return result.data ?? [];
        },
        enabled,
    });

    return { holdings: data, isPending, isError, error };
}