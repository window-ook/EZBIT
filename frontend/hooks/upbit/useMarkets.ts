'use client';

import { useQuery } from '@tanstack/react-query';
import { marketQuery } from '@/queries/upbit/market.query';
import { INTERNAL_PATHS } from '@/lib/api/apiPaths';
import { IUpbitMarket } from '@/types/upbit/market';
import { apiClient } from '@/lib/api/apiClient';
import { CONSOLE_ERROR } from '@/utils/constants/messages';

/** 
 * 업비트 KRW 마켓 모든 종목 페칭 훅
 * @description 라우트 핸들러를 통해 업비트 KRW 마켓 모든 종목 조회
 * @returns {markets: IUpbitMarket[]}
 */
export function useMarkets() {
    const fetchMarkets = async (): Promise<IUpbitMarket[]> => {
        const response = await apiClient<{ data: IUpbitMarket[] }>(INTERNAL_PATHS.UPBIT.MARKETS);
        if (!response || !response.data) throw new Error(CONSOLE_ERROR.HOOK_MARKETS_FAIL);
        return response.data;
    };

    const { data, isError, error } = useQuery({
        queryKey: marketQuery.all(),
        queryFn: fetchMarkets,
    });

    return { markets: data, isError, error };
}