import { useMutation } from '@tanstack/react-query';
import { createBrowserSupabaseClient } from 'utils/supabase/client';

export function useVerifyCodeMutation() {
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

        onError: error => console.error(error),
    });

    return { verifyCode: verifyCode.mutate };
}
