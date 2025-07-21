'use server';

import { createServerSupabaseClient } from '@/utils/supabase/server';
import { Database } from 'types_db';

export type UsersInsert = Database['public']['Tables']['users']['Insert'];

/** 초기 유저 생성 서버 액션 (이미 존재하면 생성하지 않음)
 * @returns true (성공 또는 이미 존재), false (실패)
 */
export async function createInitialUser(): Promise<boolean> {
    try {
        const supabase = await createServerSupabaseClient();

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            console.error('인증이 되지 않은 유저입니다.');
            return false;
        }

        // 이미 유저가 존재하는지 확인
        const { data: existingUser } = await supabase
            .from('users')
            .select('user_id')
            .eq('user_id', user.id)
            .single();

        // 이미 존재하면 성공으로 간주
        if (existingUser) return true;

        // 존재하지 않으면 새로 생성
        const { error } = await supabase.from('users').insert<UsersInsert>({
            user_id: user.id,
            holding_krw: 30000000,
            total_invested: 0,
        });

        if (error) {
            console.error('유저 초기 정보 생성 중 에러:', error.message);
            return false;
        }

        return true;
    } catch (error) {
        console.error('유저 초기 정보 생성 중 에러:', error);
        return false;
    }
}