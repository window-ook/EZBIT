import { NextResponse } from 'next/server';
import { ITopics } from '@/types/trends/topics';

export async function GET() {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/mock/topics.json`);
        const data: ITopics = await res.json();
        return NextResponse.json(data);
    } catch {
        return NextResponse.json([], { status: 500 });
    }
} 