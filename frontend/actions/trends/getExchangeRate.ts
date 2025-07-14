'use server';

import { apiClient } from '@/lib/api/apiClient';
import { IExchangeRate, IExchangeRateApiResponse } from '@/types/trends/exchangeRate';

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
 * @description ExchangeRate API 조회
 */
export async function getExchangeRate(): Promise<IExchangeRate[] | null> {

    const API_KEY = process.env.EXCHANGE_RATE_API_KEY;
    if (!API_KEY) {
        console.error('환율 API 키가 없습니다.');
        return null;
    }

    const data = await apiClient<IExchangeRateApiResponse>(`https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`, {}, 'external');
    if (!data) throw new Error('환율 데이터가 없습니다.');

    if (data.result !== 'success') throw new Error(`API 에러: ${data.result}`);
    if (!data.conversion_rates || !data.conversion_rates['KRW']) throw new Error('환율 데이터가 없습니다.');

    const missingCurrencies = CURRENCIES.filter(currency => !data.conversion_rates[currency]);
    if (missingCurrencies.length > 0) throw new Error(`누락된 통화: ${missingCurrencies.join(', ')}`);

    return getKrwRate(data.conversion_rates);
}