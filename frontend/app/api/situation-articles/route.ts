import { NextResponse } from 'next/server';
import { fetchSituationArticles } from '@/lib/data/fetchSituationArticles';

/** 시황 뉴스 조회 API */
export async function GET() {
    console.log('🚀 시황 뉴스 조회 API 호출');

    try {
        const data = await fetchSituationArticles();
        return NextResponse.json(data);
    } catch (error) {
        console.error('❌ 시황 뉴스 조회 실패:', error);
        return NextResponse.json({
            message: '시황 뉴스 조회 실패',
            error: String(error)
        }, { status: 500 });
    }
}