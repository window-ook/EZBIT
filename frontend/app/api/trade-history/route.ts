import { NextRequest, NextResponse } from 'next/server';
import { apiClient } from '@/lib/api/apiClient';
import { IUpbitTrade } from '@/types/upbit/trade';

const UPBIT_BASE_URL = 'https://api.upbit.com/v1' as const;
const DEFAULT_LIMIT = 50 as const;

/**
 * 업비트 API에서 특정 마켓의 초기 체결내역 데이터를 가져오는 API 엔드포인트
 * @param request - Next.js Request 객체
 * @returns Promise<NextResponse> - 체결내역 데이터 또는 에러 응답
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const market = searchParams.get('market');
  const count = parseInt(searchParams.get('count') || DEFAULT_LIMIT.toString(), 10);

  if (!market) {
    return NextResponse.json(
      { error: '마켓 코드가 필요합니다.' },
      { status: 400 }
    );
  }

  try {
    const response = await apiClient<IUpbitTrade[]>(`${UPBIT_BASE_URL}/trades/ticks?market=${market}&count=${count}`, {
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