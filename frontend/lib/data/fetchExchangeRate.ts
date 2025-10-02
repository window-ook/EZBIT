import { apiClient } from '@/lib/api/apiClient';
import { EXTERNAL_PATHS } from '@/lib/api/paths';
import { IExchangeRate, IExchangeRateResponse } from '@/types/trends/exchangeRate';

const CURRENCIES = ['USD', 'JPY', 'CNY', 'EUR'] as const;

/** USD -> KRW 환율 변환
 * @param conversionRates - 환율 데이터
 * @returns KRW 기준 환율 배열
 */
const getKrwRate = (conversionRates: { [key: string]: number }): IExchangeRate[] => {
  const KRW = conversionRates['KRW'];

  return CURRENCIES.map(currency => ({
    currency,
    rate: KRW * (1 / conversionRates[currency]),
  }));
};

/** 환율 데이터를 조회
 * @returns Promise<IExchangeRate[] | null> - 환율 데이터 또는 null
 * @throws Error - 환율 데이터 조회 실패 시
 */
export async function fetchExchangeRate(): Promise<IExchangeRate[] | null> {
  const API_KEY = process.env.EXCHANGE_RATE_API_KEY;

  if (!API_KEY) return null;

  try {
    const data = await apiClient<IExchangeRateResponse>(EXTERNAL_PATHS.exchangeRate(API_KEY), {}, 'external');

    if (!data) throw new Error('환율 데이터가 없습니다.');
    if (data.result !== 'success') throw new Error(`API 에러: ${data.result}`);
    if (!data.conversion_rates || !data.conversion_rates['KRW']) throw new Error('환율 데이터가 없습니다.');

    return getKrwRate(data.conversion_rates);
  } catch (error) {
    console.error('환율 데이터 조회 에러:', error);
    throw new Error('환율 데이터를 가져오는데 실패했습니다.');
  }
}