'use server';

import { createServerSupabaseClient } from '@/utils/supabase/server';
import { ISupabaseUser } from '@/types/supabase/users';
import { IServerActionResponse } from '@/types/shared/serverAction';

/** 
 * 유저 정보 조회 서버 액션
 * @returns {Promise<IServerActionResponse<ISupabaseUser>>}
 */
export async function getUserData(): Promise<IServerActionResponse<ISupabaseUser>> {
    const supabase = await createServerSupabaseClient();

    const { data: user } = await supabase.auth.getUser();
    const user_id = user.user?.id;

    if (!user_id) return { success: false, message: '로그인이 필요합니다.' };

    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('user_id', user_id)
        .single();

    if (error) return { success: false, message: error.message };

    return { success: true, data };
} 