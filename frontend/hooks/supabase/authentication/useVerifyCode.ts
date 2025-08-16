'use client';

import { createInitialUser } from '@/actions/supabase/users/createInitialUser';
import { useMutation } from '@tanstack/react-query';
import { createBrowserSupabaseClient } from 'utils/supabase/client';

/** Supabase 이메일 인증 훅
 * @returns { verifyCode: (email: string, code: string) => Promise<void> }
 */
export function useVerifyCode() {
    const supabase = createBrowserSupabaseClient();

    const verifyCode = useMutation({
        mutationFn: async ({ email, code }: { email: string; code: string }) => {
            const { error } = await supabase.auth.verifyOtp({
                type: 'signup',
                email,
                token: code,
            });

            if (error) throw new Error(error.message);
        },

        onSuccess: async () => {
            const userCreated = await createInitialUser();
            if (!userCreated) console.error('유저 정보 생성에 실패했습니다.');
        },

        onError: error => console.error(error),
    });

    return { verifyCode: verifyCode.mutate };
}
