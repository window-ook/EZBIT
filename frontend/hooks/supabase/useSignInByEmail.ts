'use client';

import { useMutation } from '@tanstack/react-query';
import { createBrowserSupabaseClient } from 'utils/supabase/client';

/** Supabase 로그인 훅
 * @returns { signIn: (email: string, password: string) => Promise<void> }
 */
export function useSignInByEmail() {
  const supabase = createBrowserSupabaseClient();

  const signIn = useMutation({
    mutationFn: async ({ email, password }: {
      email: string;
      password: string;
    }) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw new Error(error.message);
      return data.session;
    },

    onSuccess: async session => {
      const user = session?.user;
      if (!user) return;
      await supabase.auth.refreshSession();
    },

    onError: error => console.error(error)
  });

  return { signIn: signIn.mutate };
}
