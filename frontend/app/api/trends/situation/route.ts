import { NextResponse } from 'next/server';
import { ISituation } from '@/types/trends/situation';

export async function GET() {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/mock/situation.json`);
        const data: ISituation = await res.json();
        return NextResponse.json(data);
    } catch {
        return NextResponse.json([], { status: 500 });
    }
} 