import { apiClient } from '@/lib/api/apiClient';
import { EXTERNAL_PATHS } from '@/lib/api/paths';
import { IExchangeRate, IExchangeRateResponse } from '@/types/trends/exchangeRate';
import { createErrorResponse, createSuccessResponse, getEnvVar, withErrorHandling } from '@/lib/api/routeHandlerUtils';

const CURRENCIES = ['USD', 'JPY', 'CNY', 'EUR'] as const;

/**
 * USD -> KRW 환율 변환 함수
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

/**
 * 환율 데이터를 조회하는 API 엔드포인트
 * @param request - Next.js Request 객체
 * @returns Promise<NextResponse> - 환율 데이터 또는 에러 응답
 */
export const GET = withErrorHandling(async () => {
  const API_KEY = getEnvVar('EXCHANGE_RATE_API_KEY');

  const data = await apiClient<IExchangeRateResponse>(
    EXTERNAL_PATHS.exchangeRate(API_KEY),
    {},
    'external'
  );

  if (!data) {
    return createErrorResponse('환율 데이터가 없습니다.');
  }

  if (data.result !== 'success') {
    return createErrorResponse(`API 에러: ${data.result}`);
  }

  if (!data.conversion_rates || !data.conversion_rates['KRW']) {
    return createErrorResponse('환율 데이터가 없습니다.');
  }

  const missingCurrencies = CURRENCIES.filter(currency => !data.conversion_rates[currency]);
  if (missingCurrencies.length > 0) {
    return createErrorResponse(`누락된 통화: ${missingCurrencies.join(', ')}`);
  }

  const exchangeRates = getKrwRate(data.conversion_rates);
  return createSuccessResponse(exchangeRates);
});