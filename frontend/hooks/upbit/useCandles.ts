'use client';

import { useQuery } from '@tanstack/react-query';
import { candlesQuery } from '@/queries/upbit/candles.query';
import { IUpbitCandleQueryParams } from '@/types/upbit/candle';
import { getCandles } from '@/actions/upbit/getCandles';

/** 업비트 캔들 조회 훅
 * @queryFn getCandles: 업비트 캔들 조회 서버 액션
 * @returns {candles: ICandles}
 */
export function useCandles(params: IUpbitCandleQueryParams) {
    const { data, isError, error } = useQuery({
        queryKey: candlesQuery.detail(params),
        queryFn: () => getCandles(params),
    });

    return { candles: data, isError, error };
}