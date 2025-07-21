import { createServerSupabaseClient } from '@/utils/supabase/server';
import { ISupabaseUser } from '@/types/supabase/user';

/** 
 * 유저 정보 조회 (Prefetch 전용)
 * @description Server Actions 대신 사용하는 prefetch 전용 함수
 * @returns ISupabaseUser | null
 */
export async function fetchUserDataForPrefetch(): Promise<ISupabaseUser | null> {
    try {
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
            console.warn('⚠️ 유저 정보 prefetch 실패:', error.message);
            return null;
        }

        return data ?? null;
    } catch (error) {
        console.warn('⚠️ 유저 정보 prefetch 에러:', error);
        return null;
    }
} 