import { NextResponse } from 'next/server';
import { fetchSituationArticles } from '@/lib/data/fetchSituationArticles';
import { createErrorResponse } from '@/lib/api/routeHandlerUtils';

/** 시황 뉴스 조회 */
export async function GET() {
    try {
        const data = await fetchSituationArticles();

        return NextResponse.json({ data }, {
            headers: {
                'Cache-Control': 'public, max-age=7200',
                'X-Data-Count': data.length.toString(),
                'X-Crawled-At': new Date().toISOString()
            }
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : '시황 뉴스 조회 실패';
        return createErrorResponse(message);
    }
}