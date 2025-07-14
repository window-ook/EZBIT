'use server';

import { createServerSupabaseClient } from '@/utils/supabase/server';

export async function resetUser() {
    const supabase = await createServerSupabaseClient();
    const { data: user } = await supabase.auth.getUser();
    if (!user?.user) throw new Error('로그인이 필요합니다.');
    const user_id = user.user.id;

    // users 테이블 초기화
    const { error: userError } = await supabase
        .from('users')
        .update({
            holding_krw: 30000000,
            total_invested: 0,
            updated_at: new Date().toISOString(),
        })
        .eq('user_id', user_id);
    if (userError) throw new Error('유저 자산 초기화 실패');

    // holdings 삭제
    const { error: holdingsError } = await supabase
        .from('holdings')
        .delete()
        .eq('user_id', user_id);
    if (holdingsError) throw new Error('보유 종목 초기화 실패');

    // history 삭제
    const { error: historyError } = await supabase
        .from('history')
        .delete()
        .eq('user_id', user_id);
    if (historyError) throw new Error('거래내역 초기화 실패');

    return true;
}