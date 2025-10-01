import { createSuccessResponse, createErrorResponse } from '@/lib/api/routeHandlerUtils';
import Upbit from '@/lib/api/upbit';

/**
 * 업비트 마켓 목록 조회
 * @returns KRW 마켓 목록
 */
export async function GET() {
  try {
    const upbit = new Upbit();
    const response = await upbit.markets();
    const krwMarkets = response.filter(market => market.market.includes('KRW'));

    return createSuccessResponse(krwMarkets);
  } catch (error) {
    const message = error instanceof Error ? error.message : '마켓 목록을 가져오는데 실패했습니다.';
    return createErrorResponse(message);
  }
}