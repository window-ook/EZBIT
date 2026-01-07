'use server';

import { createServerSupabaseClient } from '@/utils/supabase/server';
import { AUTH_ERROR, DB_ERROR } from '@/utils/constants/messages';

/**
 * 계정 초기화 서버 액션
 */
export async function resetUserData(): Promise<boolean> {
    const supabase = await createServerSupabaseClient();
    const { data: user } = await supabase.auth.getUser();

    if (!user?.user) throw new Error(AUTH_ERROR.LOGIN_REQUIRED);
    const user_id = user.user.id;

    // users 초기화
    const { error: userError } = await supabase
        .from('users')
        .update({
            holding_krw: 30000000,
            total_invested: 0,
            updated_at: new Date().toISOString(),
        })
        .eq('user_id', user_id);

    if (userError) throw new Error(DB_ERROR.USER_ASSET_RESET_FAIL);

    // holdings 삭제
    const { error: holdingsError } = await supabase
        .from('holdings')
        .delete()
        .eq('user_id', user_id);

    if (holdingsError) throw new Error(DB_ERROR.USER_HOLDINGS_RESET_FAIL);

    // history 삭제
    const { error: historyError } = await supabase
        .from('history')
        .delete()
        .eq('user_id', user_id);

    if (historyError) throw new Error(DB_ERROR.USER_HISTORY_RESET_FAIL);

    return true;
}