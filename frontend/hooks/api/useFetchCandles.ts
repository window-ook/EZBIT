'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/apiClient';
import { candlesQuery } from '@/queries/exchange/candles.query';
import { ICandlesParams } from '@/types/exchange/candles';

const fetchCandles = async (params: ICandlesParams) => {
    const queryObj: Record<string, string> = {};
    Object.entries(params).forEach(([key, value]) => { if (value !== undefined) queryObj[key] = String(value); });
    const data = await apiClient(`/api/exchange/candles?${new URLSearchParams(queryObj).toString()}`);
    return data;
};

/** 업비트 종목 목록 조회 커스텀 훅
 * @queryFn getMarkets: 업비트 종목 목록 조회 서버 액션
 * @returns {markets: IUpbitMarkets}
 */
export function useFetchCandles(params: ICandlesParams) {
    const { data, isError, error } = useSuspenseQuery({
        queryKey: candlesQuery.detail(params),
        queryFn: () => fetchCandles(params),
    });

    return { candles: data, isError, error };
}