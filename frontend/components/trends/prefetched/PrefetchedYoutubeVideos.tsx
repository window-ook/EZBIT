import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { youtubeQuery } from '@/queries/trends/youtubeVideos.query';
import { IYoutubeVideosResponse } from '@/types/trends/youtubeVideos';
import { sortByUploadDate } from '@/utils/shared/date';
import { apiClient } from '@/lib/api/apiClient';
import { EXTERNAL_PATHS } from '@/lib/api/paths';
import React from 'react';

const TWO_HOURS = 2 * 60 * 60 * 1000;

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
            return sortByUploadDate(data, 12);
        },
        staleTime: TWO_HOURS,
        gcTime: TWO_HOURS * 2,
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            {children}
        </HydrationBoundary>
    );
}

