'use server';

import { createServerSupabaseClient } from '@/utils/supabase/server';
import { AUTH_ERROR } from '@/utils/constants/messages';
import { ISupabaseHoldings } from '@/types/supabase/holdings';

/**
 * 보유 자산 조회 서버 액션
 */
export async function getHoldings(): Promise<ISupabaseHoldings[]> {
    const supabase = await createServerSupabaseClient();

    const { data: userData } = await supabase.auth.getUser();
    const user_id = userData.user?.id;

    if (!user_id) throw new Error(AUTH_ERROR.LOGIN_REQUIRED);

    const { data, error } = await supabase
        .from('holdings')
        .select('*')
        .eq('user_id', user_id)
        .order('updated_at', { ascending: false });

    if (error) throw new Error(error.message);

    return data ?? [];
} 