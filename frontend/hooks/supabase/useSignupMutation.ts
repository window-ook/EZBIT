'use client';

import { useMutation } from '@tanstack/react-query';
import { createBrowserSupabaseClient } from 'utils/supabase/client';

export function useSignUpMutation() {
  const supabase = createBrowserSupabaseClient();

  const signUp = useMutation({
    mutationFn: async ({ email, password, }: {
      email: string;
      password: string;
    }) => {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/signUp/confirm`,
        },
      });

      if (error) throw new Error(error.message);
    },

    onSuccess: async () => await supabase.auth.refreshSession(),

    onError: error => console.error(error),
  });

  return { signUp: signUp.mutate };
}
