import { NextResponse } from 'next/server';
import { ITopics } from '@/types/trends/topics';
import { EXTERNAL_PATHS } from '@/lib/api/paths';
import { apiClient } from '@/lib/api/apiClient';

export async function GET() {
    try {
        const data = await apiClient<ITopics>(EXTERNAL_PATHS.TRENDS.TOPICS);
        return NextResponse.json(data);
    } catch {
        return NextResponse.json([], { status: 500 });
    }
} 