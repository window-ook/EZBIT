import { NextResponse } from 'next/server';
import { fetchMarketCapTopCoins } from '@/lib/data/fetchMarketCapTopCoins';

/** 시가총액 TOP 5 조회 API */
export async function GET() {
    console.log('🚀 시가총액 TOP 5 API 호출');

    try {
        const data = await fetchMarketCapTopCoins();

        return NextResponse.json(data, {
            headers: {
                'Cache-Control': 'public, max-age=300',
                'X-Data-Count': data.length.toString(),
                'X-Crawled-At': new Date().toISOString()
            }
        });

    } catch (error) {
        console.error('❌ 시가총액 TOP 5 API 에러:', error);
        return NextResponse.json({
            message: '시가총액 TOP 5 데이터 조회 실패',
            error: String(error)
        }, { status: 500 });
    }
}