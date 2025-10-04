import { CONSOLE_ERROR } from '@/constants/messages';
import { apiClient } from '@/lib/api/apiClient';
import { INTERNAL_PATHS } from '@/lib/api/paths';
import { IExchangeRate, IExchangeRateResponse, IKoreaEximExchangeRateResponse } from '@/types/trends/exchangeRate';

const CURRENCIES = ['USD', 'EUR', 'JPY(100)', 'CNH'] as const;

/**
 * 날짜를 YYYYMMDD 형식으로 변환
 */
function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}

/**
 * 특정 날짜의 환율 데이터
 */
async function fetchExchangeRateByDate(searchDate: string): Promise<IExchangeRate[] | null> {
  const url = INTERNAL_PATHS.EXCHANGE_RATE(searchDate);
  const response = await apiClient<{ data: IKoreaEximExchangeRateResponse[] }>(url);
  const data = response.data;

  if (!data || !Array.isArray(data)) return null;

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

  return exchangeRates.length > 0 ? exchangeRates : null;
}

/**
 * 환율 데이터 페칭 함수
 * @returns 환율 데이터 및 조회 날짜 또는 null
 */
export async function fetchExchangeRate(): Promise<IExchangeRateResponse | null> {
  try {
    const startDate = new Date();
    const day = startDate.getDay();

    if (day === 0) startDate.setDate(startDate.getDate() - 2);
    else if (day === 6) startDate.setDate(startDate.getDate() - 1);

    const MAX_RETRY_DAYS = 7;

    for (let i = 0; i < MAX_RETRY_DAYS; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(currentDate.getDate() - i);

      const dayOfWeek = currentDate.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) continue;

      const searchDate = formatDate(currentDate);
      const exchangeRates = await fetchExchangeRateByDate(searchDate);

      if (exchangeRates) return { exchangeRates, searchDate };
    }

    return null;
  } catch (error) {
    console.error(CONSOLE_ERROR.EXCHANGE_RATE_FAIL, error instanceof Error && error.message);
    return null;
  }
}