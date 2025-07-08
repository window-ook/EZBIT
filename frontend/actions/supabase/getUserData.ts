'use server';

import { createServerSupabaseClient } from '@/utils/supabase/server';
import { ISupabaseUser } from '@/types/supabase/user';

/** 유저 정보 조회
 * @returns ISupabaseUser
 */
export async function getUserData(): Promise<ISupabaseUser | null> {
    const supabase = await createServerSupabaseClient();

    const { data: userData } = await supabase.auth.getUser();

    const user_id = userData.user?.id;

    if (!user_id) throw new Error('로그인이 필요합니다.');

    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('user_id', user_id)
        .single();

    if (error) throw new Error(error.message);

    return data ?? {};
} 