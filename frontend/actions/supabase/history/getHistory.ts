'use server';

import { createServerSupabaseClient } from '@/utils/supabase/server';
import { AUTH_ERROR } from '@/utils/constants/messages';
import { ISupabaseHistory } from '@/types/supabase/history';

/**
 * 거래 내역 조회 서버 액션
 */
export async function getHistory(): Promise<ISupabaseHistory[]> {
    const supabase = await createServerSupabaseClient();

    const { data: userData } = await supabase.auth.getUser();
    const user_id = userData.user?.id;

    if (!user_id) throw new Error(AUTH_ERROR.LOGIN_REQUIRED);

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