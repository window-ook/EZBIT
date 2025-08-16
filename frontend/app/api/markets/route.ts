import { createSuccessResponse, withErrorHandling } from '@/lib/api/routeHandlerUtils';
import Upbit from '@/lib/api/upbit';

/**
 * 업비트 마켓 목록 조회
 * @returns KRW 마켓 목록
 */
export const GET = withErrorHandling(async () => {
  const upbit = new Upbit();
  const response = await upbit.markets();
  const krwMarkets = response.filter(market => market.market.includes('KRW'));

  return createSuccessResponse(krwMarkets);
});