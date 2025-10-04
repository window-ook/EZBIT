'use client';

import { useQuery } from '@tanstack/react-query';
import { marketQuery } from '@/queries/upbit/market.query';
import { INTERNAL_PATHS } from '@/lib/api/paths';
import { IUpbitMarket } from '@/types/upbit/market';
import { apiClient } from '@/lib/api/apiClient';

/** 
 * 업비트 종목 목록 페칭 훅
 * @description 라우트 핸들러를 통해 업비트 마켓 목록을 조회합니다.
 * @returns {markets: IUpbitMarket[]}
 */
export function useMarkets() {
    const fetchMarkets = async (): Promise<IUpbitMarket[]> => {
        const response = await apiClient<{ data: IUpbitMarket[] }>(INTERNAL_PATHS.UPBIT.MARKETS);
        if (!response || !response.data) throw new Error('마켓 데이터를 가져오는데 실패했습니다.');
        return response.data;
    };

    const { data, isError, error } = useQuery({
        queryKey: marketQuery.all(),
        queryFn: fetchMarkets,
    });

    return { markets: data, isError, error };
}