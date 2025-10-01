'use server';

import { createServerSupabaseClient } from '@/utils/supabase/server';
import { Database } from 'types_db';
import { IServerActionResponse } from '@/types/common/serverAction';

export type UsersInsert = Database['public']['Tables']['users']['Insert'];

/** 초기 유저 생성 서버 액션 (이미 존재하면 생성하지 않음)
 * @returns {Promise<IServerActionResponse>}
 */
export async function createInitialUser(): Promise<IServerActionResponse> {
    const supabase = await createServerSupabaseClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, message: '로그인이 필요합니다.' };

    const { data: existingUser } = await supabase
        .from('users')
        .select('user_id')
        .eq('user_id', user.id)
        .single();

    if (existingUser) return { success: true };

    const { error } = await supabase.from('users').insert<UsersInsert>({
        user_id: user.id,
        holding_krw: 30000000,
        total_invested: 0,
    });

    if (error) return { success: false, message: error.message };

    return { success: true };
}