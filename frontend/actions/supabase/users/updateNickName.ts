'use server';

import { createServerSupabaseClient } from '@/utils/supabase/server';
import { AUTH_ERROR, VALIDATION_ERROR } from '@/utils/constants/messages';

/**
 * 사용자의 nickname을 업데이트하는 서버 액션
 * @param nickname - 새로운 닉네임
 */
export async function updateNickName(nickname: string): Promise<boolean> {
    if (!nickname || nickname.trim().length === 0) throw new Error(VALIDATION_ERROR.NICKNAME_REQUIRED);
    if (nickname.trim().length > 20) throw new Error(VALIDATION_ERROR.NICKNAME_TOO_LONG);

    const supabase = await createServerSupabaseClient();

    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) throw new Error(AUTH_ERROR.LOGIN_REQUIRED);

    const { error: updateError } = await supabase
        .from('users')
        .update({ nickname: nickname.trim() })
        .eq('user_id', user.id);

    if (updateError) throw new Error(updateError.message);

    return true;
}