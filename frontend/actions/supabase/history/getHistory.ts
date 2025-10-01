'use server';

import { createServerSupabaseClient } from '@/utils/supabase/server';
import { ISupabaseHistory } from '@/types/supabase/history';
import { IServerActionResponse } from '@/types/common/serverAction';

/** 거래내역 목록 조회 서버 액션
 * @returns {Promise<IServerActionResponse<ISupabaseHistory[]>>}
 */
export async function getHistory(): Promise<IServerActionResponse<ISupabaseHistory[]>> {
    const supabase = await createServerSupabaseClient();

    const { data: userData } = await supabase.auth.getUser();

    const user_id = userData.user?.id;

    if (!user_id) return { success: false, message: '로그인이 필요합니다.' };

    const { data, error } = await supabase
        .from('history')
        .select('*')
        .eq('user_id', user_id)
        .order('created_at', { ascending: false });

    if (error) return { success: false, message: error.message };

    const historyData = (data ?? []).map((item) => ({
        ...item,
        order_type: item.order_type as 'BID' | 'ASK',
    }));

    return { success: true, data: historyData };
}