import { NextResponse } from 'next/server';
import { fetchTopicsArticles } from '@/lib/data/fetchTopicsArticles';
import { createErrorResponse } from '@/lib/api/routeHandlerUtils';

/** 토픽 뉴스 조회*/
export async function GET() {
    try {
        const data = await fetchTopicsArticles();

        return NextResponse.json({ data }, {
            headers: {
                'Cache-Control': 'public, max-age=7200',
                'X-Data-Count': data.length.toString(),
                'X-Crawled-At': new Date().toISOString()
            }
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : '토픽 뉴스 조회 실패';
        return createErrorResponse(message);
    }
}