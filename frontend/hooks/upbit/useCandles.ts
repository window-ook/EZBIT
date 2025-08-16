'use client';

import { useQuery } from '@tanstack/react-query';
import { candlesQuery } from '@/queries/upbit/candles.query';
import { IUpbitCandle, IUpbitCandleQueryParams } from '@/types/upbit/candle';
import { apiClient } from '@/lib/api/apiClient';
import { INTERNAL_PATHS } from '@/lib/api/paths';

/** 업비트 캔들 조회 훅
 * @description 라우트 핸들러를 통해 업비트 캔들 데이터를 조회합니다.
 * @returns {candles: ICandles}
 */
export function useCandles(params: IUpbitCandleQueryParams) {
    /**
     * 라우트 핸들러를 통해 캔들 데이터를 가져옵니다.
     * @returns Promise<any>
     */
    const fetchCandles = async () => {
        const searchParams = new URLSearchParams({
            type: params.type,
            ticker: params.ticker,
            count: params.count.toString(),
            ...(params.unit && { unit: params.unit.toString() }),
            ...(params.to && { to: params.to }),
        });

        const url = INTERNAL_PATHS.CANDLES(searchParams);
        console.log('🔍 useCandles fetchCandles:', { params, url });

        const response = await apiClient<{ data: IUpbitCandle[] }>(url);
        console.log('🔍 useCandles response:', response);

        if (!response || !response.data) throw new Error('캔들 데이터를 가져오는데 실패했습니다.');

        return response.data;
    };

    const { data, isError, error } = useQuery({
        queryKey: candlesQuery.detail(params),
        queryFn: fetchCandles,
    });

    return { candles: data, isError, error };
}