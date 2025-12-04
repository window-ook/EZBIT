'use client';

import { createBrowserSupabaseClient } from 'utils/supabase/client';

/** 
 * 구글 로그인 함수 
 * @success 리다이렉트
 * @error 에러 메시지 출력
*/
export const signInWithGoogle = async () => {
    const supabase = createBrowserSupabaseClient();

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback` },
    });

    if (data) return;
    if (error) console.error(error.message);
};