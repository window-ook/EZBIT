'use server';

import { createServerSupabaseClient } from '@/utils/supabase/server';
import { IServerActionResponse } from '@/types/shared/serverAction';

/**
 * 사용자의 nickname을 업데이트하는 서버 액션
 * @param nickname - 새로운 닉네임
 * @returns {Promise<IServerActionResponse>}
 */
export async function updateNickName(nickname: string): Promise<IServerActionResponse> {
    if (!nickname || nickname.trim().length === 0) return { success: false, message: '닉네임은 필수입니다.' };
    if (nickname.trim().length > 20) return { success: false, message: '닉네임은 20자 이하로 입력해주세요.' };

    const supabase = await createServerSupabaseClient();

    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) return { success: false, message: '로그인이 필요합니다.' };

    const { error: updateError } = await supabase
        .from('users')
        .update({ nickname: nickname.trim() })
        .eq('user_id', user.id);

    if (updateError) return { success: false, message: updateError.message };

    return { success: true };
}