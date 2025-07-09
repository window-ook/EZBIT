'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { getHoldings } from '@/actions/supabase/getHoldings';
import { holdingsQuery } from '@/queries/supabase/holdings.query';
import { ISupabaseHoldings } from '@/types/supabase/holdings';

/**
 * 보유 자산 목록을 조회하는 커스텀 훅
 * 로그인하지 않은 경우 holdings는 빈 배열을 반환합니다.
 * @returns { holdings: IHoldings[], isError: boolean, error: unknown }
 */
export function useFetchHoldings() {
    const { data, isError, error } = useSuspenseQuery({
        queryKey: holdingsQuery.all(),
        queryFn: getHoldings,
    });

    return { holdings: data as ISupabaseHoldings[], isError, error };
}