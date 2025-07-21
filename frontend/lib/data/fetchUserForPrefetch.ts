import { createServerSupabaseClient } from '@/utils/supabase/server';
import { ISupabaseUser } from '@/types/supabase/user';

/** 
 * 유저 정보 조회 (Prefetch 전용)
 * @description Server Actions 대신 사용하는 prefetch 전용 함수
 * @returns ISupabaseUser | null
 */
export async function fetchUserForPrefetch(): Promise<ISupabaseUser | null> {
    try {
        // 빌드 시점에서는 사용자 정보가 없으므로 null 반환
        if (typeof window !== 'undefined' || process.env.NODE_ENV === 'development') {
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
        }

        // 빌드 시점에서는 null 반환 (에러 없이)
        return null;
    } catch (error) {
        console.warn('⚠️ 유저 정보 prefetch 에러:', error);
        return null; // 에러 시에도 null 반환 (앱 크래시 방지)
    }
} 