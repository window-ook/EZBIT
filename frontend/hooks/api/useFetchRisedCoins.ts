'use client';

import { apiClient } from '@/lib/api/apiClient';
import { INTERNAL_PATHS } from '@/lib/api/paths';
import { risedCoinsQuery } from '@/queries/trends/risedCoins.query';
import { IRisedCoins } from '@/types/trends/risedCoins';
import { useSuspenseQuery } from '@tanstack/react-query';

const fetchRisedCoins = async (): Promise<IRisedCoins> => {
    const data = await apiClient<IRisedCoins>(INTERNAL_PATHS.TRENDS.RISED_COINS);
    return data;
};

/**
 * 상승률 TOP5 코인을 조회하는 커스텀 훅
 * @returns React Query useSuspenseQuery 결과 객체
 */
export function useFetchRisedCoins() {
    const { data, isError, error } = useSuspenseQuery({
        queryKey: risedCoinsQuery.all(),
        queryFn: fetchRisedCoins,
    });

    return { topRisedCoins: data, isError, error };
}