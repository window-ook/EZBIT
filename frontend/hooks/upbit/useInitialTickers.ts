'use client';

import { useQuery } from '@tanstack/react-query';
import { useMarkets } from '@/hooks/upbit/useMarkets';
import { tickerQuery } from '@/queries/upbit/ticker.query';
import { apiClient } from '@/lib/api/apiClient';
import { INTERNAL_PATHS } from '@/lib/api/apiPaths';
import { ITicker } from '@/types/upbit/ticker';
import { CONSOLE_ERROR } from '@/utils/constants/messages';

/** 
 * 업비트 초기 현재가 데이터 페칭 훅
 * @description 거래소 페이지 접속 시 모든 KRW 마켓의 현재가를 REST API로 한 번에 페칭
 * @returns {initialTickers: Record<string, ITicker>, isPending: boolean, error: Error}
 */
export function useInitialTickers() {
    const { markets } = useMarkets();

    const fetchTickers = async (): Promise<Record<string, ITicker>> => {
        const response = await apiClient<{ data: Record<string, ITicker> }>(INTERNAL_PATHS.UPBIT.TICKERS, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ markets: markets || [] }),
        });
        if (!response || !response.data) throw new Error(CONSOLE_ERROR.HOOK_TICKER_FAIL);
        return response.data;
    };

    const { data: initialTickers, isPending, error, isError } = useQuery({
        queryKey: tickerQuery.byMarkets(markets?.map(m => m.market) || []),
        queryFn: fetchTickers,
        enabled: !!markets && markets.length > 0,
        refetchOnWindowFocus: false,
    });

    return {
        initialTickers: initialTickers || {},
        isPending,
        isError,
        error
    };
}