import { NextResponse } from 'next/server';
import { getSituationData } from '@/lib/data/situation';

/** 시황 조회 API */
export async function GET() {
    try {
        const data = await getSituationData();
        return NextResponse.json(data);
    } catch (error) {
        console.error('❌ 시황 크롤링 실패:', error);
        return NextResponse.json({
            message: '시황 데이터 조회 실패',
            error: String(error)
        }, { status: 500 });
    }
}