'use client';

import { apiClient } from '@/lib/api/apiClient';
import { INTERNAL_PATHS } from '@/lib/api/paths';
import { useQuery } from '@tanstack/react-query';
import { candlesQuery } from '@/queries/upbit/candles.query';
import { IUpbitCandle, IUpbitCandleQueryParams } from '@/types/upbit/candle';

/** 
 * 업비트 캔들 데이터 조회 훅
 * @description 라우트 핸들러를 통해 업비트 캔들 데이터를 조회합니다.
 * @returns {candles: ICandles}
 */
export function useCandles(params: IUpbitCandleQueryParams) {
    const fetchCandles = async () => {
        const searchParams = new URLSearchParams({
            type: params.type,
            ticker: params.ticker,
            count: params.count.toString(),
            ...(params.unit && { unit: params.unit.toString() }),
            ...(params.to && { to: params.to }),
        });

        const url = INTERNAL_PATHS.UPBIT.CANDLES(searchParams);
        const response = await apiClient<{ data: IUpbitCandle[] }>(url);
        if (!response || !response.data) throw new Error('캔들 데이터를 가져오는데 실패했습니다.');
        return response.data;
    };

    const { data, isError, error } = useQuery({
        queryKey: candlesQuery.detail(params),
        queryFn: fetchCandles,
    });

    return { candles: data, isError, error };
}