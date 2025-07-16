'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/apiClient';
import { ICrawlTopCoins } from '@/types/upbit/top';

const SIX_HOURS = 6 * 60 * 60 * 1000;

export function useFetchWeeklyTopCoins() {
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['weekly-top'],
        queryFn: () => apiClient<ICrawlTopCoins[]>('/api/weekly-top'),
        staleTime: SIX_HOURS,
        gcTime: SIX_HOURS * 2,
        retry: 2,
        retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    });

    return { weeklyTopCoins: data, isLoading, isError, error };
}