import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { candlesQuery } from '@/queries/exchange/candles.query';
import { apiClient } from '@/lib/api/apiClient';
import { ICandlesParams } from '@/types/exchange/candles';
import React from 'react';

const fetchCandles = async (params: ICandlesParams) => {
    const queryObj: Record<string, string> = {};
    Object.entries(params).forEach(([key, value]) => { if (value !== undefined) queryObj[key] = String(value); });
    const data = await apiClient(`/api/exchange/candles?${new URLSearchParams(queryObj).toString()}`);
    return data;
};

export default async function PrefetchedCandleChart({ params, children }: { params: ICandlesParams, children: React.ReactNode }) {
    const queryClient = new QueryClient();
    await queryClient.prefetchQuery({
        queryKey: candlesQuery.detail(params),
        queryFn: () => fetchCandles(params),
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            {children}
        </HydrationBoundary>
    );
}