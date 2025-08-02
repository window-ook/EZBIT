'use server';

import { createServerSupabaseClient } from '@/utils/supabase/server';
import { ISupabaseUser } from '@/types/supabase/user';

/** 유저 정보 조회 서버 액션
 * @returns ISupabaseUser | null
 * @error 로그인하지 않은 사용자나 에러 발생 시 null 반환
 */
export async function getUserData(): Promise<ISupabaseUser | null> {
    const supabase = await createServerSupabaseClient();

    const { data: user } = await supabase.auth.getUser();
    const user_id = user.user?.id;

    if (!user_id) return null;

    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('user_id', user_id)
        .single();

    if (error) {
        console.warn('⚠️ 유저 정보 조회 실패:', error.message);
        return null;
    }

    return data ?? null;
} 