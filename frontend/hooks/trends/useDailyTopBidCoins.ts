'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { dailyTopBidCoinsQuery } from '@/queries/trends/dailyTopBidCoins.query';
import { apiClient } from '@/lib/api/apiClient';
import { INTERNAL_PATHS } from '@/lib/api/paths';
import { ITopCoins } from '@/types/upbit/topCoins';

const THREE_MINUTES = 3 * 60 * 1000;

/** 일간 체결강도 TOP 5 조회 훅
 * @returns {ITopCoins[]} 일간 체결강도 TOP 5 목록
 */
export function useDailyTopBidCoins() {
    const { data, isError, error } = useSuspenseQuery({
        queryKey: dailyTopBidCoinsQuery.all(),
        queryFn: () => apiClient<ITopCoins[]>(INTERNAL_PATHS.dailyTopBidCoins),
        staleTime: THREE_MINUTES,       // 3분 동안 신선 (체결강도는 더 자주 변함)
        gcTime: THREE_MINUTES * 4,      // 12분 동안 캐시 유지
        retry: 3,
        retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
        refetchInterval: THREE_MINUTES, // 3분마다 백그라운드 갱신
        refetchOnWindowFocus: false,
        refetchOnMount: false, // 무한 요청 방지
    });

    return { dailyBidData: data, isError, error };
}