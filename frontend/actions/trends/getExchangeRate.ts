'use server';

import { apiClient } from '@/lib/api/apiClient';
import { EXTERNAL_PATHS } from '@/lib/api/paths';
import { IExchangeRate, IExchangeRateResponse } from '@/types/trends/exchangeRate';

const CURRENCIES = ['USD', 'JPY', 'CNY', 'EUR'];

const getKrwRate = (conversionRates: { [key: string]: number }): IExchangeRate[] => {
    const KRW = conversionRates['KRW'];

    return CURRENCIES.map(currency => ({
        currency,
        rate: KRW * (1 / conversionRates[currency]),
    }));
};

/**
 * 환율 데이터 조회 서버 액션
 * @returns 환율 데이터 (KRW 기준)
 * @throws 에러 메세지 (실패 시)
 */
export async function getExchangeRate(): Promise<IExchangeRate[] | null> {
    const API_KEY = process.env.EXCHANGE_RATE_API_KEY;

    if (!API_KEY) {
        console.error('ExchangeRate API 키가 없습니다.');
        return null;
    }

    const data = await apiClient<IExchangeRateResponse>(EXTERNAL_PATHS.exchangeRate(API_KEY), {}, 'external');

    if (!data) throw new Error('환율 데이터가 없습니다.');
    if (data.result !== 'success') throw new Error(`API 에러: ${data.result}`);
    if (!data.conversion_rates || !data.conversion_rates['KRW']) throw new Error('환율 데이터가 없습니다.');

    const missingCurrencies = CURRENCIES.filter(currency => !data.conversion_rates[currency]);
    if (missingCurrencies.length > 0) throw new Error(`누락된 통화: ${missingCurrencies.join(', ')}`);

    return getKrwRate(data.conversion_rates);
}