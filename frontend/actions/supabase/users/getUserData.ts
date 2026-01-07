'use server';

import { createServerSupabaseClient } from '@/utils/supabase/server';
import { AUTH_ERROR } from '@/utils/constants/messages';
import { ISupabaseUser } from '@/types/supabase/users';

/**
 * 유저 정보 조회 서버 액션
 */
export async function getUserData(): Promise<ISupabaseUser> {
    const supabase = await createServerSupabaseClient();

    const { data: user } = await supabase.auth.getUser();
    const user_id = user.user?.id;

    if (!user_id) throw new Error(AUTH_ERROR.LOGIN_REQUIRED);

    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('user_id', user_id)
        .single();

    if (error) throw new Error(error.message);

    return data;
} 