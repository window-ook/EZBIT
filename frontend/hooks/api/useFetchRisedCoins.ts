import { risedCoinsQuery } from '@/queries/trends/risedCoins.query';
import { IRisedCoins } from '@/types/trends/risedCoins';
import { useSuspenseQuery } from '@tanstack/react-query';

const fetchRisedCoins = async (): Promise<IRisedCoins> => {
    try {
        const res = await fetch('/api/trends/rised-coins');
        const data: IRisedCoins = await res.json();
        return data;
    } catch {
        return [];
    }
};

/**
 * 상승률 TOP5 코인을 조회하는 커스텀 훅
 * @returns React Query useSuspenseQuery 결과 객체
 */
export function useFetchRisedCoins() {
    const { data, isError, error } = useSuspenseQuery({
        queryKey: risedCoinsQuery.all(),
        queryFn: fetchRisedCoins,
    });

    return { topRisedCoins: data, isError, error };
}