import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { youtubeQuery } from '@/queries/trends/youtubeVideos.query';
import { sortByUploadDate } from '@/utils/shared/date';
import { fetchYoutubeVideos } from '@/lib/data/fetchYoutubeVideos';
import React from 'react';

export default async function PrefetchedYoutubeVideos({ children }: { children: React.ReactNode }) {
    const queryClient = new QueryClient();

    try {
        await queryClient.prefetchQuery({
            queryKey: youtubeQuery.all(),
            queryFn: async () => {
                const data = await fetchYoutubeVideos({ keyword: '비트코인', maxResults: '8' });
                return sortByUploadDate(data, 12);
            },
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