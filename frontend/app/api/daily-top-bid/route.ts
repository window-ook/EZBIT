import { NextResponse } from 'next/server';
import { fetchDailyTopBidCoins } from '@/lib/data/dailyTopBidCoins';

/** 일 매수 체결강도 TOP 5 조회 API */
export async function GET() {
    console.log('🚀 일 매수 체결강도 API 호출');

    try {
        const data = await fetchDailyTopBidCoins();

        return NextResponse.json(data, {
            headers: {
                'Cache-Control': 'public, max-age=60',
                'X-Data-Count': data.length.toString(),
                'X-Crawled-At': new Date().toISOString()
            }
        });

    } catch (error) {
        console.error('❌ 일 매수 체결강도 API 에러:', error);
        return NextResponse.json({
            message: '일 매수 체결강도 데이터 조회 실패',
            error: String(error)
        }, { status: 500 });
    }
}