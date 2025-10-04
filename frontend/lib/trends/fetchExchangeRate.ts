import { apiClient } from '@/lib/api/apiClient';
import { EXTERNAL_PATHS } from '@/lib/api/paths';
import { IExchangeRate, IExchangeRateResponse } from '@/types/trends/exchangeRate';

const CURRENCIES = ['USD', 'JPY', 'CNY', 'EUR'] as const;

/** 
 * 환율 데이터 페칭 함수
 * @returns Promise<IExchangeRate[] | null> - 환율 데이터 또는 null
 */
export async function fetchExchangeRate(): Promise<IExchangeRate[] | null> {
  const API_KEY = process.env.EXCHANGE_RATE_API_KEY;

  if (!API_KEY) return null;

  const data = await apiClient<IExchangeRateResponse>(EXTERNAL_PATHS.EXCHANGE_RATE(API_KEY), {}, 'external');

  if (!data) throw new Error('환율 데이터가 없습니다.');
  if (data.result !== 'success') throw new Error(`API 에러: ${data.result}`);
  if (!data.conversion_rates || !data.conversion_rates['KRW']) throw new Error('환율 데이터가 없습니다.');

  const KRW = data.conversion_rates['KRW'];

  return CURRENCIES.map(currency => ({
    currency,
    rate: KRW * (1 / data.conversion_rates[currency]),
  }));
}