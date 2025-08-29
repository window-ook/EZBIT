import { NextRequest, NextResponse } from 'next/server';
import { apiClient } from '@/lib/api/apiClient';
import { EXTERNAL_PATHS } from '@/lib/api/paths';
import { IUpbitOrderbook } from '@/types/upbit/orderbook';

/**
 * 업비트 특정 마켓의 초기 오더북 데이터 조회
 * @param request - Next.js Request 객체
 * @returns 오더북 데이터 또는 에러 응답
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

  try {
    const response = await apiClient<IUpbitOrderbook[]>(EXTERNAL_PATHS.UPBIT.ORDERBOOK(EXTERNAL_PATHS.UPBIT.BASE_URL, market), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    }, 'external');

    if (!response || !Array.isArray(response) || response.length === 0) {
      return NextResponse.json(
        { data: null },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { data: response[0] as IUpbitOrderbook },
      { status: 200 }
    );
  } catch (error) {
    console.error('getInitialOrderbook 오류:', error);
    return NextResponse.json(
      { error: '오더북 데이터를 가져오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}