import { NextRequest } from 'next/server';
import { IUpbitCandleQueryParams } from '@/types/upbit/candle';
import { createErrorResponse, createSuccessResponse, getQueryParam, withErrorHandling } from '@/lib/api/routeHandlerUtils';
import Upbit from '@/lib/api/upbit';

/**
 * 업비트 캔들 데이터를 조회하는 API 엔드포인트
 * @param request - Next.js Request 객체
 * @returns Promise<NextResponse> - 캔들 데이터 또는 에러 응답
 * @memo 캔들 데이터는 웹소켓이 베타이면서, 일/주/월/년 캔들을 제공하지 않아 REST API로 조회
 */
export const GET = withErrorHandling(async (request: NextRequest) => {
  const type = getQueryParam(request, 'type', true);
  const ticker = getQueryParam(request, 'ticker', true);
  const count = parseInt(getQueryParam(request, 'count') || '0', 10);
  const unit = getQueryParam(request, 'unit');
  const to = getQueryParam(request, 'to');

  if (!type || !ticker) {
    return createErrorResponse('type과 ticker 파라미터가 필요합니다.', 400);
  }

  const params: IUpbitCandleQueryParams = { type, ticker, count, unit: unit ? parseInt(unit, 10) : undefined, to: to || undefined };

  const upbit = new Upbit();
  let data;

  switch (type) {
    case '1min':
    case '5min':
      if (!params.unit) {
        return createErrorResponse('unit(몇 분)을 입력하세요.', 400);
      }
      data = await upbit.candleMinutes(params.unit, ticker, count, to || undefined);
      break;
    case 'days':
      data = await upbit.candleDays(ticker, count);
      break;
    case 'day':
      data = await upbit.candleDays(ticker, count, to || undefined);
      break;
    case 'weeks':
      data = await upbit.candleWeeks(ticker, count);
      break;
    case 'months':
      data = await upbit.candleMonths(ticker, count);
      break;
    default:
      return createErrorResponse('유효하지 않은 타입입니다.', 400);
  }

  return createSuccessResponse(data);
});