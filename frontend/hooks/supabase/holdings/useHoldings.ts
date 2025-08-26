'use client';

import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { holdingsQuery } from '@/queries/supabase/holdings.query';
import { getHoldings } from '@/actions/supabase/holdings/getHoldings';

/**
 * 보유 자산을 조회하는 훅 (Suspense 사용)
 * @description SSR/Hydration이 필요한 컴포넌트에서 사용
 * @queryFn getHoldings: 보유 자산 조회 서버 액션
 * @returns {holdings, isError, error}
 */
export function useHoldings() {
    const { data, isError, error } = useSuspenseQuery({
        queryKey: holdingsQuery.all(),
        queryFn: () => getHoldings(),
    });

    return { holdings: data, isError, error };
}

/**
 * 보유 자산을 조회하는 훅
 * @description 로그인 상태에 따라 조건부로 실행
 * @param enabled - 쿼리 활성화 여부 (조건부 실행)
 * @returns {holdings, isLoading, isError, error}
 */
export function useHoldingsConditional(enabled: boolean = true) {
    const { data, isLoading, isError, error } = useQuery({
        queryKey: holdingsQuery.all(),
        queryFn: () => getHoldings(),
        enabled,
    });

    return { holdings: data, isLoading, isError, error };
}