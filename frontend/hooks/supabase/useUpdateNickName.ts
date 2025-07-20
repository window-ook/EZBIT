'use client';

import { useMutation } from '@tanstack/react-query';
import { updateNickName } from '@/actions/supabase/updateNickName';


/** Supabase 닉네임 업데이트 훅
 * @description Supabase Auth에서 사용자의 nickname을 업데이트
 * @returns {{ updateNickName: (nickname: string) => Promise<void>, isLoading: boolean }}
 */
export function useUpdateNickName() {
    const { mutateAsync: updateNickNameMutation, isPending } = useMutation({
        mutationFn: async (nickname: string) => {
            const result = await updateNickName(nickname);
            if (!result.success) {
                throw new Error(result.error || '업데이트에 실패했습니다.');
            }
            return result;
        },
        onError: (error) => {
            console.error('Display name 업데이트 오류:', error);
        }
    });

    return {
        updateNickName: updateNickNameMutation,
        isLoading: isPending
    };
}