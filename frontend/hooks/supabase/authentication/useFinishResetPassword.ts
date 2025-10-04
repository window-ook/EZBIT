'use client';

import { useMutation } from '@tanstack/react-query';
import { createBrowserSupabaseClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { ALERT_MESSAGE } from '@/constants/messages';

/** 
 * 비밀번호 재설정 완료 훅
 * @description 새 비밀번호를 설정하고 자동 로그아웃 처리
 * @returns { finishReset: (newPassword: string) => void, isPending, error }
 */
export function useFinishResetPassword() {
    const supabase = createBrowserSupabaseClient();
    const router = useRouter();

    const mutation = useMutation({
        mutationFn: async (newPassword: string) => {
            const { error } = await supabase.auth.updateUser({ password: newPassword.trim() });
            if (error) throw new Error(error.message);
            return '비밀번호가 성공적으로 변경되었습니다.';
        },

        onSuccess: async (message) => {
            alert(message);
            // AuthProvider 리다이렉션 버그 방지용 플래그 추가
            sessionStorage.setItem('password-reset-completed', 'true');
            await supabase.auth.signOut();
            router.push('/reset-password/complete');
        },

        onError: (error) => {
            if (error.message.includes('same password') || error.message.includes('Same password')) alert(ALERT_MESSAGE.SUBMIT_RESET_PASSWORD_FAIL_SAME_PASSWORD);
            else if (error.message.includes('weak password') || error.message.includes('too short')) alert(ALERT_MESSAGE.SUBMIT_RESET_PASSWORD_FAIL_LESS_THAN_EIGHT);
            else alert(ALERT_MESSAGE.SUBMIT_RESET_PASSWORD_FAIL);
        }
    });

    return {
        finishReset: mutation.mutate,
        isPending: mutation.isPending,
        error: mutation.error
    };
} 