import { NextResponse } from 'next/server';
import { fetchSituationArticles } from '@/lib/data/fetchSituationArticles';

/** 시황 조회 API */
export async function GET() {
    try {
        const data = await fetchSituationArticles();
        return NextResponse.json(data);
    } catch (error) {
        console.error('❌ 시황 조회 실패:', error);
        return NextResponse.json({
            message: '시황 데이터 조회 실패',
            error: String(error)
        }, { status: 500 });
    }
}