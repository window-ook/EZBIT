'use client';

import { createInitialUser } from '@/actions/supabase/createInitialUser';
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

        onSuccess: async () => await createInitialUser(),

        onError: error => console.error(error),
    });

    return { verifyCode: verifyCode.mutate };
}
