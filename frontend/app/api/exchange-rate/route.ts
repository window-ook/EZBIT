import { NextRequest } from 'next/server';
import { createErrorResponse, createSuccessResponse } from '@/lib/api/routeHandlerHelpers';
import { EXTERNAL_PATHS } from '@/lib/api/paths';
import { CONSOLE_ERROR } from '@/constants/messages';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const searchDate = searchParams.get('searchDate');

    if (!searchDate) return createErrorResponse(CONSOLE_ERROR.EXCHANGE_RATE_NO_SEARCHDATE);

    const AUTH_KEY = process.env.KOREAEXIM_AUTH_KEY;

    if (!AUTH_KEY) return createErrorResponse(CONSOLE_ERROR.EXCHANGE_RATE_NO_AUTH_KEY);

    const url = EXTERNAL_PATHS.EXCHANGE_RATE(AUTH_KEY, searchDate);

    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      return createErrorResponse(`${CONSOLE_ERROR.EXCHANGE_RATE_FAIL}: ${res.status} ${errorText}`);
    }

    const data = await res.json();

    return createSuccessResponse(data);
  } catch (error) {
    return createErrorResponse(CONSOLE_ERROR.EXCHANGE_RATE_FAIL);
  }
}