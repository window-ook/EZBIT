'use server';

import { createServerSupabaseClient } from '@/utils/supabase/server';
import { ISupabaseHistory } from '@/types/supabase/history';

/** 거래내역 목록 조회 서버 액션
 * @returns ISupabaseHistory[]
 * @throws 에러 메세지
 */
export async function getHistory(): Promise<ISupabaseHistory[]> {
    const supabase = await createServerSupabaseClient();

    const { data: userData } = await supabase.auth.getUser();

    const user_id = userData.user?.id;

    if (!user_id) throw new Error('로그인이 필요합니다.');

    const { data, error } = await supabase
        .from('history')
        .select('*')
        .eq('user_id', user_id)
        .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);

    return (data ?? []).map((item) => ({
        ...item,
        order_type: item.order_type as 'BID' | 'ASK',
    }));
}