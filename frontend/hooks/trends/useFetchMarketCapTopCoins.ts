'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/apiClient';
import { ITopCoins } from '@/types/upbit/topCoins';
import { marketCapTop10Query } from '@/queries/trends/marketCapTop10.query';

const FIVE_MINUTES = 5 * 60 * 1000;

/**
 * 시가총액 TOP 10 조회 훅
 * @returns {ITopCoins[]} 시가총액 TOP 10 목록
 */
export function useFetchMarketCapTopCoins() {
    const { data, isLoading, isFetching, isError } = useQuery({
        queryKey: marketCapTop10Query.all(),
        queryFn: () => apiClient<ITopCoins[]>('/api/market-cap-top'),
        staleTime: FIVE_MINUTES,
        gcTime: FIVE_MINUTES * 4,
        retry: 3,
        retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
        refetchInterval: FIVE_MINUTES,
        refetchOnWindowFocus: false,
        refetchOnMount: true,
    });

    return { marketCapTop10Data: data, isLoading, isFetching, isError };
}