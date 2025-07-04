'use client';

import { useQuery } from '@tanstack/react-query';
import { getMarkets } from '@/actions/shared/getMarkets';
import { marketQuery } from '@/queries/shared/market.query';

export function useFetchMarkets() {
    const { data, isError, error } = useQuery({
        queryKey: marketQuery.all(),
        queryFn: getMarkets,
    });

    return { markets: data, isError, error };
}