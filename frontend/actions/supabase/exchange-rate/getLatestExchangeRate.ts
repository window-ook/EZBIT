'use server';

import { createServerSupabaseClient } from '@/utils/supabase/server';
import { IExchangeRateDB } from '@/types/trends/exchangeRate';
import { IServerActionResponse } from '@/types/shared/serverAction';

/** 
 * 최신 환율 데이터 조회 서버 액션
 * @returns {Promise<IServerActionResponse<IExchangeRateDB>>}
 */
export async function getLatestExchangeRate(): Promise<IServerActionResponse<IExchangeRateDB>> {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
        .from('exchange_rates')
        .select('*')
        .order('search_date', { ascending: false })
        .limit(1)
        .single();

    if (error) return { success: false, message: error.message };
    if (!data) return { success: false, message: '환율 데이터가 없습니다.' };

    return { success: true, data: data as IExchangeRateDB };
}