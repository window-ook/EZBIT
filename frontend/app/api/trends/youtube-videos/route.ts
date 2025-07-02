import { NextResponse } from 'next/server';
import { IYoutubeVideosResponse } from '@/types/trends/video';

export async function GET() {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/mock/youtube_videos.json`);
        const data: IYoutubeVideosResponse = await res.json();
        return NextResponse.json(data);
    } catch {
        return NextResponse.json({ kind: '', etag: '', items: [] }, { status: 500 });
    }
} 