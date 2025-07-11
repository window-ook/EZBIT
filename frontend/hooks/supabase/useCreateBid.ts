import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createBid } from '@/actions/supabase/createBid';
import { userQuery } from '@/queries/supabase/user.query';
import { ISupabaseUser } from '@/types/supabase/user';

/**
 * 매수 주문 커스텀 훅
 * @description 낙관적 업데이트를 통해 UI 즉시 반영
 * @returns {mutate, isLoading, ...}
 */
export function useCreateBid() {
    const queryClient = useQueryClient();

    const requestBid = useMutation({
        mutationFn: async (params: { market: string, quantity: number, price: number, total: number }) => {
            const response = await createBid(params.market, params.quantity, params.price, params.total);
            return response;
        },
        onMutate: async (variables) => {
            await queryClient.cancelQueries({ queryKey: userQuery.all() });

            // 주문 실패 시 이전 데이터로 롤백
            const previousUser = queryClient.getQueryData<ISupabaseUser>(userQuery.all());

            // 낙관적 업데이트: 즉시 주문총액을 주문가능 금액에서 차감
            if (previousUser) {
                queryClient.setQueryData<ISupabaseUser>(userQuery.all(), {
                    ...previousUser,
                    holding_krw: previousUser.holding_krw - variables.total
                });
            }

            return { previousUser };
        },
        onError: (err, variables, context) => {
            if (context?.previousUser) queryClient.setQueryData(userQuery.all(), context.previousUser);
        },
        onSettled: () => queryClient.invalidateQueries({ queryKey: userQuery.all() })
    });

    return { requestBid: requestBid.mutate };
}