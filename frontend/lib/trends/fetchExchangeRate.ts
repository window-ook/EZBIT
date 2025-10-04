import { CONSOLE_ERROR } from '@/constants/messages';
import { apiClient } from '@/lib/api/apiClient';
import { IExchangeRate, IExchangeRateResponse, IKoreaEximExchangeRateResponse } from '@/types/trends/exchangeRate';

const CURRENCIES = ['USD', 'EUR', 'JPY(100)', 'CNH'] as const;

/**
 * 환율 데이터 페칭 함수
 * @returns Promise<IExchangeRateResponse | null> - 환율 데이터 및 조회 날짜 또는 null
 */
export async function fetchExchangeRate(): Promise<IExchangeRateResponse | null> {
  const AUTH_KEY = process.env.KOREAEXIM_AUTH_KEY;

  if (!AUTH_KEY) return null;

  const searchDate = '20251002';
  const url = `https://www.koreaexim.go.kr/site/program/financial/exchangeJSON?authkey=${AUTH_KEY}&searchdate=${searchDate}&data=AP01`;
  const data = await apiClient<IKoreaEximExchangeRateResponse[]>(url, {}, 'external');

  if (!data) throw new Error(CONSOLE_ERROR.EXCHANGE_RATE_FAIL);
  if (!Array.isArray(data)) throw new Error(CONSOLE_ERROR.EXCHANGE_RATE_TYPE);

  const exchangeRates: IExchangeRate[] = [];

  for (const currency of CURRENCIES) {
    const item = data.find(d => d.cur_unit === currency && d.result === 1);
    if (!item) continue;

    const rate = parseFloat(item.deal_bas_r.replace(/,/g, ''));
    if (isNaN(rate)) continue;

    exchangeRates.push({
      currency,
      rate,
    });
  }

  if (exchangeRates.length === 0) throw new Error(CONSOLE_ERROR.EXCHANGE_RATE_FAIL);

  return { exchangeRates, searchDate };
}