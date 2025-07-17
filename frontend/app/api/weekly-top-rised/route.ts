import { NextResponse } from 'next/server';
import { fetchWeeklyTopRisedCoins } from '@/lib/data/weeklyTopRisedCoins';

/** 주간 상승률 TOP 10 조회 API */
export async function GET() {
    console.log('🚀 주간 상승률 API 호출');

    try {
        const data = await fetchWeeklyTopRisedCoins();

        return NextResponse.json(data, {
            headers: {
                'Cache-Control': 'public, max-age=60',
                'X-Data-Count': data.length.toString(),
                'X-Crawled-At': new Date().toISOString()
            }
        });

    } catch (error) {
        console.error('❌ 주간 상승률 API 에러:', error);
        return NextResponse.json({
            message: '주간 상승률 데이터 조회 실패',
            error: String(error)
        }, { status: 500 });
    }
}
