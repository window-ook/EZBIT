'use server';

import { createServerSupabaseClient } from '@/utils/supabase/server';
import { IExchangeRateDB } from '@/types/trends/exchangeRate';

/**
 * 최신 환율 데이터 조회 서버 액션
 */
export async function getLatestExchangeRate(): Promise<IExchangeRateDB | null> {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
        .from('exchange_rates')
        .select('*')
        .order('search_date', { ascending: false })
        .limit(1)
        .single();

    if (error) return null;
    if (!data) return null;

    return data as IExchangeRateDB;
}