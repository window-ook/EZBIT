import { NextRequest, NextResponse } from 'next/server';
import { apiClient } from '@/lib/api/apiClient';
import { EXTERNAL_PATHS } from '@/lib/api/paths';
import { IUpbitTrade } from '@/types/upbit/trade';

const DEFAULT_LIMIT = 50 as const;

/** 체결내역 데이터 조회
 * @param request - Next.js Request 객체
 * @returns 체결내역 데이터 또는 에러 응답
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const market = searchParams.get('market');

  if (!market) {
    return NextResponse.json(
      { error: '마켓 코드가 필요합니다.' },
      { status: 400 }
    );
  }

  const count = parseInt(searchParams.get('count') || DEFAULT_LIMIT.toString(), 10);

  try {
    const response = await apiClient<IUpbitTrade[]>(EXTERNAL_PATHS.UPBIT.TRADES(EXTERNAL_PATHS.UPBIT.BASE_URL, market, count), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    }, 'external');

    const data = response;

    if (!data || !Array.isArray(data)) {
      return NextResponse.json(
        { data: [] },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { data: data as IUpbitTrade[] },
      { status: 200 }
    );
  } catch (error) {
    console.error('getInitialTradeHistory 오류:', error);
    return NextResponse.json(
      { error: '체결내역 데이터를 가져오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}