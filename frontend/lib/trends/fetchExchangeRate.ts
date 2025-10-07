import { saveExchangeRate, getLatestExchangeRate } from '@/actions/supabase/exchange-rate';
import { apiClient } from '@/lib/api/apiClient';
import { INTERNAL_PATHS } from '@/lib/api/paths';
import { IExchangeRate, IExchangeRateResponse, IKoreaEximExchangeRateResponse, IExchangeRateDB, IExchangeRateDBInsert } from '@/types/trends/exchangeRate';
import { CONSOLE_ERROR } from '@/constants/messages';

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
 * IExchangeRate[] 배열을 DB 삽입용 형식으로 변환
 */
function convertToDBInsert(rates: IExchangeRate[], searchDate: string): IExchangeRateDBInsert {
  return {
    search_date: searchDate,
    usd_rate: rates.find(r => r.currency === 'USD')?.rate ?? null,
    jpy_rate: rates.find(r => r.currency === 'JPY(100)')?.rate ?? null,
    cnh_rate: rates.find(r => r.currency === 'CNH')?.rate ?? null,
    eur_rate: rates.find(r => r.currency === 'EUR')?.rate ?? null,
  };
}

/**
 * DB 데이터를 IExchangeRate[] 형식으로 변환
 */
function convertFromDB(dbData: IExchangeRateDB): IExchangeRate[] {
  const rates: IExchangeRate[] = [];

  if (dbData.usd_rate) rates.push({ currency: 'USD', rate: dbData.usd_rate });
  if (dbData.jpy_rate) rates.push({ currency: 'JPY(100)', rate: dbData.jpy_rate });
  if (dbData.cnh_rate) rates.push({ currency: 'CNH', rate: dbData.cnh_rate });
  if (dbData.eur_rate) rates.push({ currency: 'EUR', rate: dbData.eur_rate });

  return rates;
}

/**
 * 특정 날짜의 환율 데이터
 * @returns 환율 데이터 배열, 데이터 없음(null), 네트워크 에러('NETWORK_ERROR')
 */
async function fetchExchangeRateByDate(searchDate: string): Promise<IExchangeRate[] | null | 'NETWORK_ERROR'> {
  try {
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
  } catch (error) {
    console.error(`${CONSOLE_ERROR.EXCHANGE_RATE_FAIL} (${searchDate}):`, error instanceof Error && error.message);
    return 'NETWORK_ERROR';
  }
}

/**
 * 환율 데이터 페칭 함수
 * 1. DB에서 최신 데이터 조회
 * 2. 오늘 영업일 데이터가 있으면 바로 반환
 * 3. 없으면 API 호출 시도 (최대 7일 전까지)
 * 4. 성공 시 DB 저장 후 반환
 * 5. 실패 시 DB에서 가장 최신 데이터 반환
 * @returns 환율 데이터 및 조회 날짜 또는 null
 */
export async function fetchExchangeRate(): Promise<IExchangeRateResponse | null> {
  try {
    const startDate = new Date();
    const day = startDate.getDay();

    if (day === 0) startDate.setDate(startDate.getDate() - 2);
    else if (day === 6) startDate.setDate(startDate.getDate() - 1);

    const todaySearchDate = formatDate(startDate);

    // 1. DB에서 최신 데이터 조회
    const latestResult = await getLatestExchangeRate();
    if (latestResult.success && latestResult.data) {
      if (latestResult.data.search_date === todaySearchDate) {
        const exchangeRates = convertFromDB(latestResult.data);
        return { exchangeRates, searchDate: latestResult.data.search_date };
      }
    }

    // 2. DB에 오늘 데이터가 없으면 API 호출
    const MAX_RETRY_DAYS = 7;

    for (let i = 0; i < MAX_RETRY_DAYS; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(currentDate.getDate() - i);

      const dayOfWeek = currentDate.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) continue;

      const searchDate = formatDate(currentDate);
      const result = await fetchExchangeRateByDate(searchDate);

      // 네트워크 에러 발생 시 바로 DB fallback으로 이동
      if (result === 'NETWORK_ERROR') break;

      if (result) {
        const dbData = convertToDBInsert(result, searchDate);
        const saveResult = await saveExchangeRate(dbData);

        if (!saveResult.success) console.error(CONSOLE_ERROR.EXCHANGE_RATE_FAIL, saveResult.message);

        return { exchangeRates: result, searchDate };
      }
    }

    // 3. API 호출도 실패하면 DB에 있는 가장 최신 데이터 반환
    if (latestResult.success && latestResult.data) {
      const exchangeRates = convertFromDB(latestResult.data);
      return { exchangeRates, searchDate: latestResult.data.search_date };
    }

    return null;
  } catch (error) {
    console.error(CONSOLE_ERROR.EXCHANGE_RATE_FAIL, error instanceof Error && error.message);
    return null;
  }
}