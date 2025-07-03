import { NextResponse } from 'next/server';
import { IRisedCoins } from '@/types/trends/risedCoins';
import { apiClient } from '@/lib/api/apiClient';
import { EXTERNAL_PATHS } from '@/lib/api/paths';

export async function GET() {
    try {
        const data = await apiClient<IRisedCoins>(EXTERNAL_PATHS.TRENDS.RISED_COINS);
        return NextResponse.json(data);
    } catch {
        return NextResponse.json([], { status: 500 });
    }
}