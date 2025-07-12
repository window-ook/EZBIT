'use server';

import { createServerSupabaseClient } from '@/utils/supabase/server';
import { Database } from 'types_db';

export type UsersInsert = Database['public']['Tables']['users']['Insert'];

/** 초기 유저 생성 서버 액션
 * @description Supabase users 조회
 * @returns true (성공 시)
 * @throws 에러 메세지 (실패 시)
 */
export async function createInitialUser() {
    const supabase = await createServerSupabaseClient();

    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase.from('users').insert<UsersInsert>({
        user_id: user?.id ?? '',
        holding_krw: 30000000,
        total_invested: 0,
    });

    if (error) throw new Error(error.message);

    return true;
}