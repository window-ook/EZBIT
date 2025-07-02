import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { youtubeQuery } from '@/queries/trends/youtube.query';
import { IYoutubeVideosResponse } from '@/types/trends/video';
import { sortVideosByUpload } from '@/utils/trends/sortVideosByUpload';
import React from 'react';

const fetchYoutubeVideos = async (): Promise<IYoutubeVideosResponse> => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/mock/youtube_videos.json`);
        const data: IYoutubeVideosResponse = await res.json();
        return data;
    } catch {
        return { kind: '', etag: '', items: [] };
    }
};

export default async function PrefetchYoutubeVideos({ children }: { children: React.ReactNode }) {
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: youtubeQuery.all(),
        queryFn: async () => {
            const data = await fetchYoutubeVideos();
            return sortVideosByUpload(data, 8);
        },
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            {children}
        </HydrationBoundary>
    );
}

