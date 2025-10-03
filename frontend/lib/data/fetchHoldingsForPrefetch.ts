import { getHoldings } from '@/actions/supabase/holdings/getHoldings';
import { ISupabaseHoldings } from '@/types/supabase/holdings';

/** 
 * 보유 자산 목록 조회 (Prefetch 전용)
 * @description Server Actions 대신 사용하는 prefetch 전용 함수
 * @returns ISupabaseHoldings[]
 */
export async function fetchHoldingsForPrefetch(): Promise<ISupabaseHoldings[]> {
    try {
        const result = await getHoldings();

        if (!result.success) {
            console.warn('⚠️ 보유 자산 prefetch 실패:', result.message);
            return [];
        }

        return result.data ?? [];
    } catch (error) {
        console.warn('⚠️ 보유 자산 prefetch 에러:', error);
        return [];
    }
} 