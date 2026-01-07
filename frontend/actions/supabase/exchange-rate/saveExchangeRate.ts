'use server';

import { createServerSupabaseAdminClient } from '@/utils/supabase/server';
import { VALIDATION_ERROR } from '@/utils/constants/messages';
import { IExchangeRateDBInsert } from '@/types/trends/exchangeRate';

/**
 * 환율 데이터 저장 서버 액션
 * @param {IExchangeRateDBInsert} data - 저장할 환율 데이터
 */
export async function saveExchangeRate(data: IExchangeRateDBInsert): Promise<boolean> {
    if (!data) throw new Error(VALIDATION_ERROR.EXCHANGE_RATE_DATA_REQUIRED);
    if (!data.search_date) throw new Error(VALIDATION_ERROR.SEARCH_DATE_REQUIRED);
    if (!data.usd_rate || data.usd_rate <= 0) throw new Error(VALIDATION_ERROR.USD_RATE_INVALID);
    if (!data.jpy_rate || data.jpy_rate <= 0) throw new Error(VALIDATION_ERROR.JPY_RATE_INVALID);
    if (!data.cnh_rate || data.cnh_rate <= 0) throw new Error(VALIDATION_ERROR.CNH_RATE_INVALID);
    if (!data.eur_rate || data.eur_rate <= 0) throw new Error(VALIDATION_ERROR.EUR_RATE_INVALID);

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

    if (error) throw new Error(error.message);

    return true;
}