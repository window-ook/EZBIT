'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/apiClient';
import { ITopCoins } from '@/types/upbit/topCoins';
import { weeklyTopRisedCoinsQuery } from '@/queries/trends/weeklyTopRisedCoins.query';
import { INTERNAL_PATHS } from '@/lib/api/paths';

const SIX_HOURS = 6 * 60 * 60 * 1000;

/** 주간 상승률 TOP 10 조회 훅
 * @returns {ITopCoins[]} 주간 상승률 TOP 10 목록
 */
export function useWeeklyTopRisedCoins() {
    const { data, isError, error } = useSuspenseQuery({
        queryKey: weeklyTopRisedCoinsQuery.all(),
        queryFn: () => apiClient<ITopCoins[]>(INTERNAL_PATHS.weeklyTopRisedCoins),
        staleTime: SIX_HOURS,
        gcTime: SIX_HOURS * 4,          // 24시간 메모리 보관 (더 길게)
        retry: 3,
        retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,      // 재연결시 자동 갱신 방지
        networkMode: 'offlineFirst',    // 캐시 우선 모드
    });

    return { weeklyTopCoins: data, isError, error };
}