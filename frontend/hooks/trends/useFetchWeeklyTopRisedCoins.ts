'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/apiClient';
import { ITopCoins } from '@/types/upbit/topCoins';
import { weeklyTopRisedCoinsQuery } from '@/queries/trends/weeklyTopRisedCoins.query';

const TEN_MINUTES = 10 * 60 * 1000;

/** 주간 상승률 TOP 10 조회 훅
 * @returns {ITopCoins[]} 주간 상승률 TOP 10 목록
 */
export function useFetchWeeklyTopRisedCoins() {
    const { data, isError, error } = useSuspenseQuery({
        queryKey: weeklyTopRisedCoinsQuery.all(),
        queryFn: () => apiClient<ITopCoins[]>('/api/weekly-top-rised'),
        staleTime: TEN_MINUTES,
        gcTime: TEN_MINUTES * 4,
        retry: 3,
        retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
        refetchOnWindowFocus: false,
        refetchOnMount: true,
    });

    return { weeklyTopCoins: data, isError, error };
}