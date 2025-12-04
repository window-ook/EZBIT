'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { createBrowserSupabaseClient } from 'utils/supabase/client';

/**
 * 로그인 훅
 * @returns mutate, error, isError, isPending
 */
export function useSignInByEmail() {
  const supabase = createBrowserSupabaseClient();
  const router = useRouter();

  const signIn = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) throw new Error(error.message);
      return data.session;
    },

    onSuccess: async session => {
      if (!session?.user) return;
      router.replace('/exchange');
    },
  });

  return signIn;
}