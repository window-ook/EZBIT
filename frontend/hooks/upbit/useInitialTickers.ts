'use client';

import { useQuery } from '@tanstack/react-query';
import { useMarkets } from '@/hooks/upbit/useMarkets';
import { getAllTickers } from '@/actions/upbit/getAllTickers';
import { tickerQuery } from '@/queries/upbit/ticker.query';

/** 초기 현재가 데이터 로딩 훅
 * @description /exchange 페이지 진입 시 모든 KRW 마켓의 현재가를 REST API로 한 번에 가져오는 훅
 * @returns {initialTickers: Record<string, ITicker>, isLoading: boolean, error: Error}
 */
export function useInitialTickers() {
    const { markets } = useMarkets();

    const { data: initialTickers, isLoading, error, isError } = useQuery({
        queryKey: tickerQuery.all(),
        queryFn: () => getAllTickers(markets || []),
        enabled: !!markets && markets.length > 0,
        refetchOnWindowFocus: false,
    });

    return {
        initialTickers: initialTickers || {},
        isLoading,
        isError,
        error
    };
}