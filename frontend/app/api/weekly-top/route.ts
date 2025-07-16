import { NextResponse } from 'next/server';
import UpbitCrawler from '@/lib/data/upbit';

const CRAWLER = UpbitCrawler.getInstance();

/** 주간 상승률 TOP 10 코인 조회 API */
export async function GET() {
    console.log('🚀 주간 상승률 API 호출 (캐시 버전)');

    try {
        const data = CRAWLER.getCachedData();
        const isFresh = CRAWLER.isDataFresh();

        if (data.length === 0) {
            return NextResponse.json({
                message: '데이터가 아직 준비되지 않았습니다. 잠시 후 다시 시도해주세요.',
                error: 'No data available'
            }, { status: 503 });
        }

        return NextResponse.json(data, {
            headers: {
                'Cache-Control': 'public, max-age=300', // 5분 캐시
                'X-Data-Fresh': isFresh.toString(),
                'X-Data-Count': data.length.toString()
            }
        });

    } catch (error) {
        console.error('❌ 캐시 데이터 조회 실패:', error);
        return NextResponse.json({
            message: '데이터 조회 실패',
            error: String(error)
        }, { status: 500 });
    }
}