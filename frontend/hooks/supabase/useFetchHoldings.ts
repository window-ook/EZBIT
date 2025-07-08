'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { getHoldings } from '@/actions/supabase/getHoldings';
import { holdingsQuery } from '@/queries/supabase/holdings.query';
import { ISupabaseHoldings } from '@/types/supabase/holdings';

/**
 * 현재 로그인한 유저의 보유 자산 목록을 조회하는 커스텀 훅
 * @returns { holdings: IHoldings[], isError: boolean, error: unknown }
 */
export function useFetchHoldings() {
    const { data, isError, error } = useSuspenseQuery({
        queryKey: holdingsQuery.all(),
        queryFn: getHoldings,
    });

    return { holdings: data as ISupabaseHoldings[], isError, error };
}
