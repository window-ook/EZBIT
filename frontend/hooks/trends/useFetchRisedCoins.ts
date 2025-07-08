'use client';

import { getRisedCoins } from '@/actions/trends/getRisedCoins';
import { risedCoinsQuery } from '@/queries/trends/risedCoins.query';
import { useSuspenseQuery } from '@tanstack/react-query';

/**
 * 상승률 TOP5 코인을 조회하는 커스텀 훅
 * @queryFn getRisedCoins: 기간별 상승률 데이터 조회 서버 액션
 * @returns React Query useSuspenseQuery 결과 객체
 */
export function useFetchRisedCoins() {
    const { data, isError, error } = useSuspenseQuery({
        queryKey: risedCoinsQuery.all(),
        queryFn: () => getRisedCoins(),
    });

    return { topRisedCoins: data, isError, error };
}