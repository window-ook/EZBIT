import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userQuery } from '@/queries/supabase/user.query';
import { ISupabaseUser } from '@/types/supabase/user';
import { createAsk } from '@/actions/supabase/createAsk';
import { ISupabaseHoldings } from '@/types/supabase/holdings';
import { holdingsQuery } from '@/queries/supabase/holdings.query';

/**
 * 매도 주문 훅
 * @description 낙관적 업데이트를 통해 UI 즉시 반영
 * @returns {requestAsk}
 */
export function useCreateAsk() {
    const queryClient = useQueryClient();

    const requestAsk = useMutation({
        mutationFn: async (params: { market: string, quantity: number, price: number, total: number, original_amount: number }) => {
            const response = await createAsk(params.market, params.quantity, params.price, params.total, params.original_amount);
            return response;
        },
        onMutate: async (variables) => {
            // 관련 쿼리들 취소
            await queryClient.cancelQueries({ queryKey: userQuery.all() });
            await queryClient.cancelQueries({ queryKey: holdingsQuery.all() });

            // 주문 실패 시 이전 데이터로 롤백
            const previousUser = queryClient.getQueryData<ISupabaseUser>(userQuery.all());
            const previousHoldings = queryClient.getQueryData<ISupabaseHoldings[]>(holdingsQuery.all());

            // 낙관적 업데이트: 유저
            if (previousUser) {
                queryClient.setQueryData<ISupabaseUser>(userQuery.all(), {
                    ...previousUser,
                    holding_krw: previousUser.holding_krw + variables.total
                });
            }

            // 낙관적 업데이트: 보유 자산
            if (previousHoldings) {
                const updatedHoldings = previousHoldings.map(holding => {
                    if (holding.market === variables.market) {
                        const newVolume = holding.total_bid_volume - variables.quantity;

                        // 수량이 0 이하가 되면 해당 holding 제거
                        if (newVolume <= 0) return null;

                        return {
                            ...holding,
                            total_bid_volume: newVolume,
                            total_bid_amount: holding.total_bid_amount - variables.total,
                            avg_bid_price: (holding.total_bid_amount - variables.total) / newVolume
                        };
                    }
                    return holding;
                }).filter(Boolean) as ISupabaseHoldings[];

                queryClient.setQueryData<ISupabaseHoldings[]>(holdingsQuery.all(), updatedHoldings);
            }

            return { previousUser, previousHoldings };
        },
        onError: (err, variables, context) => {
            // 에러 시 이전 데이터로 롤백
            if (context?.previousUser) queryClient.setQueryData(userQuery.all(), context.previousUser);
            if (context?.previousHoldings) queryClient.setQueryData(holdingsQuery.all(), context.previousHoldings);
        },
        onSettled: () => {
            // 성공/실패 관계없이 쿼리 무효화
            queryClient.invalidateQueries({ queryKey: userQuery.all() });
            queryClient.invalidateQueries({ queryKey: holdingsQuery.all() });
        }
    });

    return { requestAsk: requestAsk.mutate };
}