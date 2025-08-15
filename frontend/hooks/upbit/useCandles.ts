'use client';

import { useQuery } from '@tanstack/react-query';
import { candlesQuery } from '@/queries/upbit/candles.query';
import { IUpbitCandleQueryParams } from '@/types/upbit/candle';

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

        const response = await fetch(`/api/candles?${searchParams.toString()}`);
        
        if (!response.ok) {
            throw new Error('캔들 데이터를 가져오는데 실패했습니다.');
        }
        
        const result = await response.json();
        return result.data;
    };

    const { data, isError, error } = useQuery({
        queryKey: candlesQuery.detail(params),
        queryFn: fetchCandles,
    });

    return { candles: data, isError, error };
}