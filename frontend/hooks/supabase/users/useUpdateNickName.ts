'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateNickName } from '@/actions/supabase/users/updateNickName';
import { userQuery } from '@/queries/supabase/users.query';
import { ISupabaseUser } from '@/types/supabase/users';


/** Supabase 닉네임 업데이트 훅
 * @description Supabase 데이터베이스에서 사용자의 nickname을 업데이트하며, 낙관적 업데이트 지원
 */
export function useUpdateNickName() {
    const queryClient = useQueryClient();

    const { mutateAsync: updateNickNameMutation, isPending } = useMutation({
        mutationFn: async (nickname: string) => {
            const result = await updateNickName(nickname);
            if (!result.success) {
                throw new Error(result.error || '업데이트에 실패했습니다.');
            }
            return result;
        },
        onMutate: async (newNickname: string) => {
            await queryClient.cancelQueries({ queryKey: userQuery.all() });

            // 이전 데이터 롤백
            const previousUserData = queryClient.getQueryData<ISupabaseUser | null>(userQuery.all());

            // 낙관적 업데이트
            queryClient.setQueryData<ISupabaseUser | null>(userQuery.all(), (old) => {
                if (old) {
                    return {
                        ...old,
                        nickname: newNickname
                    };
                }

                return old;
            });

            return { previousUserData };
        },
        onError: (error, _variables, context) => {
            console.error('Nickname 업데이트 오류:', error);

            // 에러 발생 시 롤백
            if (context?.previousUserData !== undefined) {
                queryClient.setQueryData(userQuery.all(), context.previousUserData);
            }
        },
        onSettled: () => {
            // 성공, 실패 관계없이 캐시 무효화
            queryClient.invalidateQueries({ queryKey: userQuery.all() });
        }
    });

    return {
        updateNickName: updateNickNameMutation,
        isLoading: isPending
    };
}