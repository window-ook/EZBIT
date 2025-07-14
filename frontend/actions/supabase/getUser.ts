'use server';

import { createServerSupabaseClient } from '@/utils/supabase/server';
import { ISupabaseUser } from '@/types/supabase/user';

/** 유저 정보 조회 서버 액션
 * @returns ISupabaseUser
 */
export async function getUser(): Promise<ISupabaseUser | null> {
    const supabase = await createServerSupabaseClient();

    const { data: user } = await supabase.auth.getUser();

    const user_id = user.user?.id;

    if (!user_id) return null;

    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('user_id', user_id)
        .single();

    if (error) throw new Error(error.message);

    return data ?? {};
} 