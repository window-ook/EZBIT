'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateNickName } from '@/actions/supabase/users/updateNickName';
import { userQuery } from '@/queries/supabase/users.query';
import { ISupabaseUser } from '@/types/supabase/users';


/**
 * 닉네임 재설정 훅
 * @description Supabase 데이터베이스에서 사용자의 nickname을 업데이트
 */
export function useUpdateNickName() {
    const queryClient = useQueryClient();

    const { mutateAsync: updateNickNameMutation, isPending } = useMutation({
        mutationFn: updateNickName,
        onMutate: async (newNickname: string) => {
            await queryClient.cancelQueries({ queryKey: userQuery.all() });

            const previousUserData = queryClient.getQueryData<ISupabaseUser | null>(userQuery.all());

            // 낙관적 업데이트
            queryClient.setQueryData<ISupabaseUser | null>(userQuery.all(), (old) => {
                if (old) return { ...old, nickname: newNickname };
                return old;
            });

            return { previousUserData };
        },

        onError: (error, _variables, context) => {
            if (context?.previousUserData !== undefined) queryClient.setQueryData(userQuery.all(), context.previousUserData);
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: userQuery.all() });
        }
    });

    return {
        updateNickName: updateNickNameMutation,
        isPending
    };
}