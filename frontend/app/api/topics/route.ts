import { NextResponse } from 'next/server';
import { fetchTopicsArticles } from '@/lib/data/fetchTopicsArticles';

/** 토픽 뉴스 조회 API */
export async function GET() {
    try {
        const data = await fetchTopicsArticles();
        return NextResponse.json(data);
    } catch (error) {
        console.error('❌ 토픽 뉴스 조회 실패:', error);
        return NextResponse.json({
            message: '토픽 데이터 조회 실패',
            error: String(error)
        }, { status: 500 });
    }
}