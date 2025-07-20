import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createBid } from '@/actions/supabase/createBid';
import { userQuery } from '@/queries/supabase/user.query';
import { holdingsQuery } from '@/queries/supabase/holdings.query';
import { ISupabaseUser } from '@/types/supabase/user';
import { ISupabaseHoldings } from '@/types/supabase/holdings';

/**
 * 매수 주문 훅
 * @description 낙관적 업데이트를 통해 UI 즉시 반영
 * @returns {requestBid}
 */
export function useCreateBid() {
    const queryClient = useQueryClient();

    const requestBid = useMutation({
        mutationFn: async (params: { market: string, quantity: number, price: number, total: number }) => {
            const response = await createBid(params.market, params.quantity, params.price, params.total);
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
                    holding_krw: previousUser.holding_krw - variables.total
                });
            }

            // 낙관적 업데이트: 보유자산
            if (previousHoldings) {
                const existingHolding = previousHoldings.find(h => h.market === variables.market);

                if (existingHolding) {
                    // 기존 보유 종목이 있는 경우 업데이트
                    const updatedHoldings = previousHoldings.map(holding => {
                        if (holding.market === variables.market) {
                            const newVolume = holding.total_bid_volume + variables.quantity;
                            const newAmount = holding.total_bid_amount + variables.total;

                            return {
                                ...holding,
                                total_bid_volume: newVolume,
                                total_bid_amount: newAmount,
                                avg_bid_price: newAmount / newVolume
                            };
                        }
                        return holding;
                    });

                    queryClient.setQueryData<ISupabaseHoldings[]>(holdingsQuery.all(), updatedHoldings);
                } else {
                    // 새로운 보유 종목 추가
                    const newHolding: ISupabaseHoldings = {
                        user_id: previousUser?.user_id || '',
                        market: variables.market,
                        total_bid_volume: variables.quantity,
                        total_bid_amount: variables.total,
                        avg_bid_price: variables.price,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    };

                    queryClient.setQueryData<ISupabaseHoldings[]>(holdingsQuery.all(), [...previousHoldings, newHolding]);
                }
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

    return { requestBid: requestBid.mutate };
}