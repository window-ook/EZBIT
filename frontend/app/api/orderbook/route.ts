import { NextRequest, NextResponse } from 'next/server';
import { apiClient } from '@/lib/api/apiClient';
import type { IUpbitOrderbook } from '@/types/upbit/orderbook';

const UPBIT_BASE_URL = 'https://api.upbit.com/v1' as const;

/**
 * 업비트 API에서 특정 마켓의 초기 오더북 데이터를 가져오는 API 엔드포인트
 * @param request - Next.js Request 객체
 * @returns Promise<NextResponse> - 오더북 데이터 또는 에러 응답
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
    const response = await apiClient<IUpbitOrderbook[]>(`${UPBIT_BASE_URL}/orderbook?markets=${market}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    }, 'external');

    const data = response;

    if (!data || !Array.isArray(data) || data.length === 0) {
      return NextResponse.json(
        { data: null },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { data: data[0] as IUpbitOrderbook },
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