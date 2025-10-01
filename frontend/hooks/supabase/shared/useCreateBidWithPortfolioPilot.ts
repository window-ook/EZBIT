import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createBidWithPortfolioPilot } from '@/actions/supabase/shared/createBidWithPortfolioPilot';
import { userQuery } from '@/queries/supabase/users.query';
import { holdingsQuery } from '@/queries/supabase/holdings.query';
import { ISupabaseUser } from '@/types/supabase/users';
import { ISupabaseHoldings } from '@/types/supabase/holdings';
import { IPilotFilteredItem } from '@/types/portfolio-pilot/portfolioPilot';

/**
 * 포트폴리오 매수 주문 훅
 * @description 여러 종목을 동시에 매수하며 낙관적 업데이트를 통해 UI 즉시 반영
 * @returns {createPortfolio: (orders: IPortfolioBidItem[]) => void, isPending: boolean}
 */
export function useCreateBidWithPortfolioPilot() {
    const queryClient = useQueryClient();

    const createPortfolio = useMutation({
        mutationFn: async (orders: IPilotFilteredItem[]) => {
            const response = await createBidWithPortfolioPilot(orders);
            return response;
        },

        onMutate: async (orders: IPilotFilteredItem[]) => {
            await queryClient.cancelQueries({ queryKey: userQuery.all() });
            await queryClient.cancelQueries({ queryKey: holdingsQuery.all() });

            const previousUser = queryClient.getQueryData<ISupabaseUser>(userQuery.all());
            const previousHoldings = queryClient.getQueryData<ISupabaseHoldings[]>(holdingsQuery.all());

            const totalOrderAmount = orders.reduce((sum, order) => sum + order.total_amount, 0);

            // 낙관적 업데이트: 유저 정보 - KRW 차감 및 총 투자금액 증가
            if (previousUser) {
                queryClient.setQueryData<ISupabaseUser>(userQuery.all(), {
                    ...previousUser,
                    holding_krw: previousUser.holding_krw - totalOrderAmount,
                    total_invested: previousUser.total_invested + totalOrderAmount
                });
            }

            // 낙관적 업데이트: 보유 자산
            if (previousHoldings) {
                const updatedHoldings = [...previousHoldings];

                orders.forEach(order => {
                    const existingIndex = updatedHoldings.findIndex(h => h.market === order.market);

                    if (existingIndex >= 0) {
                        // 기존 보유 종목이 있는 경우
                        const existing = updatedHoldings[existingIndex];
                        const newVolume = existing.total_bid_volume + order.volume;
                        const newAmount = existing.total_bid_amount + order.total_amount;

                        updatedHoldings[existingIndex] = {
                            ...existing,
                            total_bid_volume: newVolume,
                            total_bid_amount: newAmount,
                            avg_bid_price: newAmount / newVolume,
                            updated_at: new Date().toISOString()
                        };
                    } else {
                        // 기존 보유 종목이 없는 경우
                        const newHolding: ISupabaseHoldings = {
                            user_id: previousUser?.user_id || '',
                            market: order.market,
                            total_bid_volume: order.volume,
                            total_bid_amount: order.total_amount,
                            avg_bid_price: order.trade_price,
                            created_at: new Date().toISOString(),
                            updated_at: new Date().toISOString()
                        };

                        updatedHoldings.push(newHolding);
                    }
                });

                queryClient.setQueryData<ISupabaseHoldings[]>(holdingsQuery.all(), updatedHoldings);
            }

            return { previousUser, previousHoldings };
        },

        onError: (error, _, context) => {
            console.error('포트폴리오 매수 실패:', error);

            // 에러 시 롤백
            if (context?.previousUser) queryClient.setQueryData(userQuery.all(), context.previousUser);
            if (context?.previousHoldings) queryClient.setQueryData(holdingsQuery.all(), context.previousHoldings);

            const errorMessage = error instanceof Error ? error.message : '포트폴리오 매수 주문에 실패했습니다.';
            alert(errorMessage);
        },

        onSuccess: (result) => {
            if (!result.success && result.message) {
                alert(result.message);
                return;
            }
            if (result.errors && result.errors.length > 0) alert(`일부 주문이 실패했습니다:\n${result.errors.join('\n')}`);
            else alert('포트폴리오 매수 주문이 완료되었습니다!');
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: userQuery.all() });
            queryClient.invalidateQueries({ queryKey: holdingsQuery.all() });
        }
    });

    return {
        createPortfolio: createPortfolio.mutate,
        isPending: createPortfolio.isPending,
        error: createPortfolio.error
    };
} 