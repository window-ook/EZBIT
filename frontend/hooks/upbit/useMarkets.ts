'use client';

import { useQuery } from '@tanstack/react-query';
import { marketQuery } from '@/queries/upbit/market.query';
import { IUpbitMarket } from '@/types/upbit/market';

/** 업비트 종목 목록 조회 훅
 * @description 라우트 핸들러를 통해 업비트 마켓 목록을 조회합니다.
 * @returns {markets: IUpbitMarket[]}
 */
export function useMarkets() {
    /**
     * 라우트 핸들러를 통해 마켓 데이터를 가져옵니다.
     * @returns Promise<IUpbitMarket[]>
     */
    const fetchMarkets = async (): Promise<IUpbitMarket[]> => {
        const response = await fetch('/api/markets');
        
        if (!response.ok) {
            throw new Error('마켓 데이터를 가져오는데 실패했습니다.');
        }
        
        const result = await response.json();
        return result.data;
    };

    const { data, isError, error } = useQuery({
        queryKey: marketQuery.all(),
        queryFn: fetchMarkets,
    });

    return { markets: data, isError, error };
}