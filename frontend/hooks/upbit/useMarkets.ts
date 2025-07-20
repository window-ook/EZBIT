'use client';

import { useQuery } from '@tanstack/react-query';
import { getMarkets } from '@/actions/upbit/getMarkets';
import { marketQuery } from '@/queries/upbit/market.query';

/** 업비트 종목 목록 조회 훅
 * @queryFn getMarkets: 업비트 종목 목록 조회 서버 액션
 * @returns {markets: IUpbitMarket[]}
 */
export function useMarkets() {
    const { data, isError, error } = useQuery({
        queryKey: marketQuery.all(),
        queryFn: getMarkets,
    });

    return { markets: data, isError, error };
}