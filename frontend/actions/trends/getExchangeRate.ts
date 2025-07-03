'use server';

import { apiClient } from '@/lib/api/apiClient';
import { ExchangeRateApiResponse, IExchangeRate } from '@/types/trends/exchangeRate';

const CURRENCIES = ['USD', 'JPY', 'CNY', 'EUR'];

const calculateRate = (conversionRates: { [key: string]: number }): IExchangeRate[] => {
    const KRW = conversionRates['KRW'];

    return CURRENCIES.map(currency => ({
        currency,
        rate: KRW * (1 / conversionRates[currency]),
    }));
};

/**
 * 환율 데이터 조회 서버 액션
 * @returns 환율 데이터 (KRW 기준)
 */
export async function getExchangeRate(): Promise<IExchangeRate[] | null> {
    try {
        const API_KEY = process.env.EXCHANGE_RATE_API_KEY;
        if (!API_KEY) {
            console.error('환율 API 키가 없습니다.');
            return null;
        }

        const data = await apiClient<ExchangeRateApiResponse>(`https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`, {}, 'external');
        if (!data) throw new Error('환율 데이터가 없습니다.');

        if (data.result !== 'success') throw new Error(`API 에러: ${data.result}`);
        if (!data.conversion_rates || !data.conversion_rates['KRW']) throw new Error('환율 데이터가 없습니다.');

        const missingCurrencies = CURRENCIES.filter(currency => !data.conversion_rates[currency]);
        if (missingCurrencies.length > 0) throw new Error(`누락된 통화: ${missingCurrencies.join(', ')}`);

        return calculateRate(data.conversion_rates);
    } catch (error) {
        console.error('환율 데이터 조회 중 에러:', error);
        if (error instanceof Error) {
            console.error('에러 메시지:', error.message);
            console.error('에러 스택:', error.stack);
        }
        return null;
    }
}