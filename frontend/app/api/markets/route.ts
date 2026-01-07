import { CONSOLE_ERROR } from '@/utils/constants/messages';
import { createSuccessResponse, createErrorResponse } from '@/lib/api/routeHandlerHelpers';
import Upbit from '@/lib/api/upbit';

/**
 * 업비트 KRW 마켓의 모든 종목 조회
 */
export async function GET() {
  try {
    const upbit = new Upbit();
    const response = await upbit.markets();
    const krwMarkets = response.filter(market => market.market.includes('KRW'));

    return createSuccessResponse(krwMarkets);
  } catch (error) {
    console.error(error);
    return createErrorResponse(CONSOLE_ERROR.ROUTE_MARKETS);
  }
}