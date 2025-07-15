'use client';

import { useQuery } from '@tanstack/react-query';
import { situationQuery } from '@/queries/trends/situation.query';
import { getSituation } from '@/actions/trends/getSituation';

const SIX_HOURS = 6 * 60 * 60 * 1000;

export function useFetchSituationArticles() {
    const { data, isLoading, isError, error } = useQuery({
        queryKey: situationQuery.all(),
        queryFn: getSituation,
        staleTime: SIX_HOURS,
        gcTime: SIX_HOURS * 2,
        retry: 2,
        retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    });

    return { situationArticles: { data, isLoading, isError, error } };
}