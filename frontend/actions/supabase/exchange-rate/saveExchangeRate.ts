'use server';

import { createServerSupabaseAdminClient } from '@/utils/supabase/server';
import { IExchangeRateDBInsert } from '@/types/trends/exchangeRate';
import { IServerActionResponse } from '@/types/shared/serverAction';

/** 
 * 환율 데이터 저장 서버 액션
 * @param {IExchangeRateDBInsert} data - 저장할 환율 데이터
 * @returns {Promise<IServerActionResponse<void>>}
 */
export async function saveExchangeRate(data: IExchangeRateDBInsert): Promise<IServerActionResponse<void>> {
    const supabase = await createServerSupabaseAdminClient();

    const { error } = await supabase
        .from('exchange_rates')
        .upsert(
            {
                search_date: data.search_date,
                usd_rate: data.usd_rate,
                jpy_rate: data.jpy_rate,
                cnh_rate: data.cnh_rate,
                eur_rate: data.eur_rate,
                updated_at: new Date().toISOString(),
            },
            {
                onConflict: 'search_date',
            }
        );

    if (error) {
        console.error('[saveExchangeRate] Error:', error);
        return { success: false, message: error.message };
    }

    return { success: true };
}