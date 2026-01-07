'use server';

import { createServerSupabaseClient } from '@/utils/supabase/server';
import { AUTH_ERROR } from '@/utils/constants/messages';
import { Database } from 'types_db';

export type UsersInsert = Database['public']['Tables']['users']['Insert'];

/**
 * 초기 유저 생성 서버 액션
 */
export async function createInitialUser(): Promise<boolean> {
    const supabase = await createServerSupabaseClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error(AUTH_ERROR.LOGIN_REQUIRED);

    const { data: existingUser } = await supabase
        .from('users')
        .select('user_id')
        .eq('user_id', user.id)
        .single();

    if (existingUser) return true;

    const { error } = await supabase.from('users').insert<UsersInsert>({
        user_id: user.id,
        holding_krw: 30000000,
        total_invested: 0,
    });

    if (error) throw new Error(error.message);

    return true;
}