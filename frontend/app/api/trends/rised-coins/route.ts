import { NextResponse } from 'next/server';
import { IRisedCoins } from '@/types/trends/risedCoins';

export async function GET() {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/mock/rised_coins.json`);
        const data: IRisedCoins = await res.json();
        return NextResponse.json(data);
    } catch {
        return NextResponse.json([], { status: 500 });
    }
} 