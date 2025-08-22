'use client';

import { useMutation } from '@tanstack/react-query';
import { createBrowserSupabaseClient } from '@/utils/supabase/client';

/** Supabase 비밀번호 재설정 요청 훅
 * @description 이메일로 비밀번호 재설정 링크를 전송합니다
 * @returns { requestReset: (email: string) => void, isPending, error }
 */
export function useResetPassword() {
    const supabase = createBrowserSupabaseClient();

    const mutation = useMutation({
        mutationFn: async ({ email, onSuccess }: { email: string; onSuccess?: () => void }) => {
            const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
                redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/reset-password`,
            });

            if (error) throw new Error(error.message);
            const message = '비밀번호 재설정 링크가 이메일로 전송되었습니다.';
            alert(message);
            if (onSuccess) onSuccess();
            return message;
        },

        onError: (error) => {
            console.error('비밀번호 재설정 요청 실패:', error);

            if (error.message.includes('rate limit') || error.message.includes('too_many_requests')) alert('재요청은 이전 요청 60초 후 가능합니다.');
            else alert('비밀번호 재설정 요청에 실패했습니다. 잠시 후 다시 시도해주세요.');
        }
    });

    return {
        requestReset: (email: string, onSuccess?: () => void) => mutation.mutate({ email, onSuccess }),
        isPending: mutation.isPending,
        error: mutation.error
    };
} 