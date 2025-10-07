'use client';

import { useMutation } from '@tanstack/react-query';
import { createBrowserSupabaseClient } from 'utils/supabase/client';

/** 
 * 로그인 훅
 * @returns mutate, error, isError, isPending
 */
export function useSignInByEmail() {
  const supabase = createBrowserSupabaseClient();

  const mutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw new Error(error.message);
      return data.session;
    },

    onSuccess: async session => {
      const user = session?.user;
      if (!user) return;
      await supabase.auth.refreshSession();
    },
  });

  return mutation;
}