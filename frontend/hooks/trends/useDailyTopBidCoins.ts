'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { dailyTopBidCoinsQuery } from '@/queries/trends/dailyTopBidCoins.query';
import { apiClient } from '@/lib/api/apiClient';
import { INTERNAL_PATHS } from '@/lib/api/paths';
import { ITopCoins } from '@/types/upbit/topCoins';

const SIX_HOURS = 6 * 60 * 60 * 1000;

/** 일 매수 체결강도 TOP 5 조회 훅
 * @returns {ITopCoins[]} 일 매수 체결강도 TOP 5 목록
 */
export function useDailyTopBidCoins() {
    const { data, isError, error } = useSuspenseQuery({
        queryKey: dailyTopBidCoinsQuery.all(),
        queryFn: () => apiClient<ITopCoins[]>(INTERNAL_PATHS.dailyTopBidCoins),
        staleTime: SIX_HOURS,
        gcTime: SIX_HOURS * 2,
        retry: 3,
        retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    });

    return { dailyBidData: data, isError, error };
}