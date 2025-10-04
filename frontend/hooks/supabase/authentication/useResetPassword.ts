'use client';

import { useMutation } from '@tanstack/react-query';
import { createBrowserSupabaseClient } from '@/utils/supabase/client';
import { ALERT_MESSAGE } from '@/constants/messages';

/** 
 * 비밀번호 재설정 요청 훅
 * @description 이메일로 비밀번호 재설정 링크를 전송합니다
 * @returns { requestReset: (email: string) => void, isPending, error }
 */
export function useResetPassword() {
    const supabase = createBrowserSupabaseClient();

    const mutation = useMutation({
        mutationFn: async ({ email, onSuccess }: { email: string; onSuccess?: () => void }) => {
            const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
                redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password`,
            });

            if (error) throw new Error(error.message);
            alert(ALERT_MESSAGE.REQUEST_RESET_PASSWORD_SUCCESS);
            if (onSuccess) onSuccess();
        },

        onError: (error) => {
            if (error.message.includes('rate limit') || error.message.includes('too_many_requests')) alert(ALERT_MESSAGE.REQUEST_RESET_PASSWORD_FAIL_TOO_MANY_REQUESTS);
            else alert(ALERT_MESSAGE.REQUEST_RESET_PASSWORD_FAIL);
        }
    });

    return {
        requestReset: (email: string, onSuccess?: () => void) => mutation.mutate({ email, onSuccess }),
        isPending: mutation.isPending,
        error: mutation.error
    };
}