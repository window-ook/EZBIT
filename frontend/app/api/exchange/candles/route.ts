import { NextRequest, NextResponse } from 'next/server';
import Upbit from '@/lib/api/upbit';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);

    const type = searchParams.get('type') || '';
    const ticker = searchParams.get('ticker') || '';
    const count = Number(searchParams.get('count') || 0);
    const unit = searchParams.get('unit') ? Number(searchParams.get('unit')) : undefined;
    const to = searchParams.get('to') || undefined;

    try {
        const upbit = new Upbit();

        let data;

        switch (type) {
            case '1min':
            case '5min':
                if (!unit) throw new Error('unit(몇 분)을 입력하세요.');
                data = await upbit.candleMinutes(unit, ticker, count, to);
                break;
            case 'days':
                data = await upbit.candleDays(ticker, count);
                break;
            case 'day':
                data = await upbit.candleDays(ticker, count, to);
                break;
            case 'weeks':
                data = await upbit.candleWeeks(ticker, count);
                break;
            case 'months':
                data = await upbit.candleMonths(ticker, count);
                break;
            default:
                throw new Error('유효하지 않은 타입입니다.');
        }

        if (!data) throw new Error('데이터를 찾을 수 없습니다.');

        return NextResponse.json(data, { status: 200 });
    } catch {
        return NextResponse.json([], { status: 500 });
    }
}