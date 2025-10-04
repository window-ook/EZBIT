import { NextRequest } from 'next/server';
import { apiClient } from '@/lib/api/apiClient';
import { EXTERNAL_PATHS } from '@/lib/api/paths';
import { IUpbitOrderbook } from '@/types/upbit/orderbook';
import { createErrorResponse, createSuccessResponse, getQueryParam } from '@/lib/api/routeHandlerHelpers';

/**
 * 업비트 오더북 데이터 조회
 * @description TickerProvider에서 호출, 웹소켓 연결 전 초기 데이터 페칭 목적
 * @param request - Next.js Request 객체
 * @returns 오더북 데이터 또는 에러 응답
 */
export async function GET(request: NextRequest) {
  try {
    const market = getQueryParam(request, 'market', true);

    if (!market) return createErrorResponse('마켓 코드가 필요합니다.', 400);

    const response = await apiClient<IUpbitOrderbook[]>(EXTERNAL_PATHS.UPBIT.ORDERBOOK(EXTERNAL_PATHS.UPBIT.BASE_URL, market), {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    }, 'external');

    if (!response || !Array.isArray(response) || response.length === 0) return createSuccessResponse(null);
    return createSuccessResponse(response[0] as IUpbitOrderbook);
  } catch (error) {
    const message = error instanceof Error ? error.message : '오더북 데이터를 가져오는데 실패했습니다.';
    return createErrorResponse(message);
  }
}