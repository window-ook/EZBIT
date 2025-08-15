'use client';

import { useQuery } from '@tanstack/react-query';
import { useMarkets } from '@/hooks/upbit/useMarkets';
import { tickerQuery } from '@/queries/upbit/ticker.query';
import { ITicker } from '@/types/upbit/ticker';

/** 초기 현재가 데이터 로딩 훅
 * @description /exchange 페이지 진입 시 모든 KRW 마켓의 현재가를 REST API로 한 번에 가져오는 훅
 * @returns {initialTickers: Record<string, ITicker>, isLoading: boolean, error: Error}
 */
export function useInitialTickers() {
    const { markets } = useMarkets();

    /**
     * 라우트 핸들러를 통해 티커 데이터를 가져옵니다.
     * @returns Promise<Record<string, ITicker>>
     */
    const fetchTickers = async (): Promise<Record<string, ITicker>> => {
        const response = await fetch('/api/tickers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ markets: markets || [] }),
        });

        if (!response.ok) {
            throw new Error('티커 데이터를 가져오는데 실패했습니다.');
        }

        const result = await response.json();
        return result.data;
    };

    const { data: initialTickers, isLoading, error, isError } = useQuery({
        queryKey: tickerQuery.byMarkets(markets?.map(m => m.market) || []),
        queryFn: fetchTickers,
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