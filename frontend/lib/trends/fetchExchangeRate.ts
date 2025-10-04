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

  if (!data) throw new Error('환율 데이터가 없습니다.');
  if (!Array.isArray(data)) throw new Error('환율 데이터 형식이 올바르지 않습니다.');

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

  if (exchangeRates.length === 0) throw new Error('환율 데이터를 찾을 수 없습니다.');

  return { exchangeRates, searchDate };
}