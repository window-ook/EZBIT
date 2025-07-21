import { createServerSupabaseClient } from '@/utils/supabase/server';
import { ISupabaseHoldings } from '@/types/supabase/holdings';

/** 
 * 보유 자산 목록 조회 (Prefetch 전용)
 * @description Server Actions 대신 사용하는 prefetch 전용 함수
 * @returns ISupabaseHoldings[]
 */
export async function fetchHoldingsForPrefetch(): Promise<ISupabaseHoldings[]> {
    try {
        if (typeof window !== 'undefined' || process.env.NODE_ENV === 'development') {
            const supabase = await createServerSupabaseClient();

            const { data: userData } = await supabase.auth.getUser();
            const user_id = userData.user?.id;

            if (!user_id) return [];

            const { data, error } = await supabase
                .from('holdings')
                .select('*')
                .eq('user_id', user_id)
                .order('updated_at', { ascending: false });

            if (error) {
                console.warn('⚠️ 보유 자산 prefetch 실패:', error.message);
                return [];
            }

            return data ?? [];
        }

        return [];
    } catch (error) {
        console.warn('⚠️ 보유 자산 prefetch 에러:', error);
        return [];
    }
} 