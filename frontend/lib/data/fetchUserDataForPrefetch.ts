import { getUserData } from '@/actions/supabase/users/getUserData';
import { ISupabaseUser } from '@/types/supabase/users';

/**
 * 유저 정보 조회
 * @description getUserData 서버 액션을 React Query queryFn에 맞게 래핑
 * @returns ISupabaseUser | null
 */
export async function fetchUserDataForPrefetch(): Promise<ISupabaseUser | null> {
    try {
        const result = await getUserData();

        if (!result.success) {
            console.warn('⚠️ 유저 정보 prefetch 실패:', result.message);
            return null;
        }

        return result.data ?? null;
    } catch (error) {
        console.warn('⚠️ 유저 정보 prefetch 에러:', error);
        return null;
    }
} 