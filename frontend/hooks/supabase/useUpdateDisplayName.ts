'use client';

import { useMutation } from '@tanstack/react-query';
import { updateDisplayName } from '@/actions/supabase/updateDisplayName';

/**
 * Display name 업데이트 커스텀 훅
 * @description Supabase Auth에서 사용자의 nickname을 업데이트
 * @returns {{ updateDisplayName: (nickname: string) => Promise<void>, isLoading: boolean }}
 */
export function useUpdateDisplayName() {
    const { mutateAsync: updateDisplayNameMutation, isPending } = useMutation({
        mutationFn: async (nickname: string) => {
            const result = await updateDisplayName(nickname);
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
        updateDisplayName: updateDisplayNameMutation,
        isLoading: isPending
    };
}