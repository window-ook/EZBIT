import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { youtubeQuery } from '@/queries/trends/youtubeVideos.query';
import { IYoutubeVideosResponse } from '@/types/trends/youtubeVideos';
import { sortByUploadDate } from '@/utils/shared/date';
import { apiClient } from '@/lib/api/apiClient';
import { EXTERNAL_PATHS } from '@/lib/api/paths';
import React from 'react';

const TWO_HOURS = 2 * 60 * 60 * 1000;

const fetchYoutubeVideos = async (): Promise<IYoutubeVideosResponse> => {
    const params = new URLSearchParams({
        part: 'snippet',
        maxResults: '8',
        type: 'video',
        q: '비트코인',
        key: process.env.GOOGLE_API_KEY || '',
    });

    const data = await apiClient<IYoutubeVideosResponse>(
        `${EXTERNAL_PATHS.TRENDS.YOUTUBE_VIDEOS}?${params.toString()}`,
        undefined,
        'external'
    );
    return data;
};

export default async function PrefetchedYoutubeVideos({ children }: { children: React.ReactNode }) {
    const queryClient = new QueryClient();

    try {
        await queryClient.prefetchQuery({
            queryKey: youtubeQuery.all(),
            queryFn: async () => {
                const data = await fetchYoutubeVideos();
                return sortByUploadDate(data, 12);
            },
            staleTime: TWO_HOURS,
            gcTime: TWO_HOURS * 2,
        });
    } catch (error) {
        console.error('❌ 유튜브 비디오 프리페치 실패:', error);
    }

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            {children}
        </HydrationBoundary>
    );
}

