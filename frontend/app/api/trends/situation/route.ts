import { NextResponse } from 'next/server';
import { ISituations } from '@/types/trends/situation';
import { apiClient } from '@/lib/api/apiClient';
import { EXTERNAL_PATHS } from '@/lib/api/paths';

export async function GET() {
    try {
        const data = await apiClient<ISituations>(EXTERNAL_PATHS.TRENDS.SITUATION);
        return NextResponse.json(data);
    } catch {
        return NextResponse.json([], { status: 500 });
    }
} 