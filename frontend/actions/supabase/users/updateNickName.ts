'use server';

import { createServerSupabaseClient } from '@/utils/supabase/server';

/**
 * 사용자의 nickname을 users 테이블에 업데이트하는 서버 액션
 * @param nickname - 새로운 닉네임
 * @returns {Promise<{ success: boolean; error?: string }>}
 */
export async function updateNickName(nickname: string) {
    try {
        if (!nickname || nickname.trim().length === 0) {
            throw new Error('닉네임은 필수입니다.');
        }

        if (nickname.trim().length > 20) {
            throw new Error('닉네임은 20자 이하로 입력해주세요.');
        }

        const supabase = await createServerSupabaseClient();

        // 현재 사용자 확인
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
            throw new Error('로그인이 필요합니다.');
        }

        // users 테이블의 nickname 업데이트
        const { error: updateError } = await supabase
            .from('users')
            .update({ nickname: nickname.trim() })
            .eq('user_id', user.id);

        if (updateError) {
            throw new Error(updateError.message);
        }

        return { success: true };
    } catch (error) {
        console.error('Nickname 업데이트 오류:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'
        };
    }
}