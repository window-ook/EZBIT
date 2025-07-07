'use client';

import { useQuery } from '@tanstack/react-query';
import { getMarkets } from '@/actions/shared/getMarkets';
import { marketQuery } from '@/queries/shared/market.query';

/** 업비트 종목 목록 조회 커스텀 훅
 * @queryFn getMarkets: 업비트 종목 목록 조회 서버 액션
 * @returns {markets: IUpbitMarkets}
 */
export function useFetchMarkets() {
    const { data, isError, error } = useQuery({
        queryKey: marketQuery.all(),
        queryFn: getMarkets,
    });

    return { markets: data, isError, error };
}