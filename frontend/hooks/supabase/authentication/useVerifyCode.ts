'use client';

import { createInitialUser } from '@/actions/supabase/users/createInitialUser';
import { CONSOLE_ERROR } from '@/constants/messages';
import { useMutation } from '@tanstack/react-query';
import { createBrowserSupabaseClient } from 'utils/supabase/client';

/** 
 * 이메일 인증 훅
 * @returns { verifyCode: (email: string, code: string) => Promise<void> }
 */
export function useVerifyCode() {
    const supabase = createBrowserSupabaseClient();

    const verifyCode = useMutation({
        mutationFn: async ({ email, code }: { email: string; code: string }) => {
            const { error } = await supabase.auth.verifyOtp({ type: 'signup', email, token: code });
            if (error) throw new Error(error.message);
        },

        onSuccess: async () => {
            const result = await createInitialUser();
            if (!result.success) console.error(CONSOLE_ERROR.INITIALIZE_NEW_USER_DATA_FAIL, result.message);
        },

        onError: error => console.error(error.message),
    });

    return { verifyCode: verifyCode.mutate };
}
