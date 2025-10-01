'use server';

import { createServerSupabaseClient } from '@/utils/supabase/server';
import { ISupabaseHoldings } from '@/types/supabase/holdings';
import { IServerActionResponse } from '@/types/common/serverAction';

/** 보유 자산 목록 조회 서버 액션
 * @returns {Promise<IServerActionResponse<ISupabaseHoldings[]>>}
 */
export async function getHoldings(): Promise<IServerActionResponse<ISupabaseHoldings[]>> {
    const supabase = await createServerSupabaseClient();

    const { data: userData } = await supabase.auth.getUser();

    const user_id = userData.user?.id;

    if (!user_id) return { success: false, message: '로그인이 필요합니다.' };

    const { data, error } = await supabase
        .from('holdings')
        .select('*')
        .eq('user_id', user_id)
        .order('updated_at', { ascending: false });

    if (error) return { success: false, message: error.message };

    return { success: true, data: data ?? [] };
} 