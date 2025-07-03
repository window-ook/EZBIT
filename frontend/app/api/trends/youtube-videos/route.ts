import { NextResponse } from 'next/server';
import { IYoutubeVideosResponse } from '@/types/trends/video';
import { EXTERNAL_PATHS } from '@/lib/api/paths';
import { apiClient } from '@/lib/api/apiClient';

export async function GET() {
    try {
        const data = await apiClient<IYoutubeVideosResponse>(EXTERNAL_PATHS.TRENDS.YOUTUBE_VIDEOS);
        return NextResponse.json(data);
    } catch {
        return NextResponse.json({ kind: '', etag: '', items: [] }, { status: 500 });
    }
} 