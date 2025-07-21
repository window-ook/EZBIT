'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/apiClient';
import { ITopCoins } from '@/types/upbit/topCoins';
import { marketCapTopCoinsQuery } from '@/queries/trends/marketCapTopCoins.query';
import { INTERNAL_PATHS } from '@/lib/api/paths';

const SIX_HOURS = 6 * 60 * 60 * 1000;

/** 시가총액 TOP 5 조회 훅
 * @returns {ITopCoins[]} 시가총액 TOP 5 목록
 */
export function useMarketCapTopCoins() {
    const { data, isError, error } = useSuspenseQuery({
        queryKey: marketCapTopCoinsQuery.all(),
        queryFn: () => apiClient<ITopCoins[]>(INTERNAL_PATHS.marketCapTopCoins),
        staleTime: SIX_HOURS,
        gcTime: SIX_HOURS * 2,
        retry: 3,
        retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    });

    return { marketCapTop10Data: data, isError, error };
}