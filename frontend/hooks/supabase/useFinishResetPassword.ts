'use client';

import { useMutation } from '@tanstack/react-query';
import { createBrowserSupabaseClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

/** Supabase 비밀번호 재설정 완료 훅
 * @description 새 비밀번호를 설정하고 자동 로그아웃 처리
 * @returns { finishReset: (newPassword: string) => void, isPending, error }
 */
export function useFinishResetPassword() {
    const supabase = createBrowserSupabaseClient();
    const router = useRouter();

    const mutation = useMutation({
        mutationFn: async (newPassword: string) => {
            const { error } = await supabase.auth.updateUser({
                password: newPassword.trim(),
            });

            if (error) throw new Error(error.message);
            return '비밀번호가 성공적으로 변경되었습니다.';
        },

        onSuccess: async (message) => {
            alert(message);

            // 비밀번호 변경 후 강제 로그아웃
            await supabase.auth.signOut();

            // 완료 페이지로 이동
            router.push('/reset-password/complete');
        },

        onError: (error) => {
            console.error('비밀번호 재설정 완료 실패:', error);

            // 기존 비밀번호와 같을 경우 처리
            if (error.message.includes('same password') || error.message.includes('Same password')) {
                alert('새로운 비밀번호는 기존 비밀번호와 달라야합니다.');
            } else if (error.message.includes('weak password') || error.message.includes('too short')) {
                alert('비밀번호는 8자 이상이어야 합니다.');
            } else {
                alert('비밀번호 변경에 실패했습니다. 다시 시도해주세요.');
            }
        }
    });

    return {
        finishReset: mutation.mutate,
        isPending: mutation.isPending,
        error: mutation.error
    };
} 