import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { youtubeQuery } from '@/queries/trends/youtubeVideos.query';
import { IYoutubeVideosResponse } from '@/types/trends/video';
import { sortVideosByUpload } from '@/utils/trends/sortVideosByUpload';
import { apiClient } from '@/lib/api/apiClient';
import { EXTERNAL_PATHS } from '@/lib/api/paths';
import React from 'react';

const fetchYoutubeVideos = async (): Promise<IYoutubeVideosResponse> => {
    const data = await apiClient<IYoutubeVideosResponse>(EXTERNAL_PATHS.TRENDS.YOUTUBE_VIDEOS);
    return data;
};

export default async function PrefetchedYoutubeVideos({ children }: { children: React.ReactNode }) {
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: youtubeQuery.all(),
        queryFn: async () => {
            const data = await fetchYoutubeVideos();
            return sortVideosByUpload(data, 12);
        },
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            {children}
        </HydrationBoundary>
    );
}

