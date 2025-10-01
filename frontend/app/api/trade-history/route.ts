import { NextRequest } from 'next/server';
import { apiClient } from '@/lib/api/apiClient';
import { EXTERNAL_PATHS } from '@/lib/api/paths';
import { IUpbitTrade } from '@/types/upbit/trade';
import { createErrorResponse, createSuccessResponse, getQueryParam } from '@/lib/api/routeHandlerUtils';

const DEFAULT_LIMIT = 50 as const;

/** 체결내역 데이터 조회
 * @param request - Next.js Request 객체
 * @returns 체결내역 데이터 또는 에러 응답
 */
export async function GET(request: NextRequest) {
  try {
    const market = getQueryParam(request, 'market', true);

    if (!market) return createErrorResponse('마켓 코드가 필요합니다.', 400);

    const count = parseInt(getQueryParam(request, 'count') || DEFAULT_LIMIT.toString(), 10);

    const response = await apiClient<IUpbitTrade[]>(EXTERNAL_PATHS.UPBIT.TRADES(EXTERNAL_PATHS.UPBIT.BASE_URL, market, count), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    }, 'external');

    const data = response;

    if (!data || !Array.isArray(data))
      return createSuccessResponse([]);

    return createSuccessResponse(data as IUpbitTrade[]);
  } catch (error) {
    const message = error instanceof Error ? error.message : '체결내역 데이터를 가져오는데 실패했습니다.';
    return createErrorResponse(message);
  }
}