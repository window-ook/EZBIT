'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { youtubeQuery } from '@/queries/trends/youtube.query';
import { IYoutubeVideosResponse } from '@/types/trends/video';
import { sortVideosByUpload } from '@/utils/trends/sortVideosByUpload';
import { apiClient } from '@/lib/api/apiClient';
import { INTERNAL_PATHS } from '@/lib/api/paths';

const fetchYoutubeVideos = async (): Promise<IYoutubeVideosResponse> => {
    const data = await apiClient<IYoutubeVideosResponse>(INTERNAL_PATHS.TRENDS.YOUTUBE_VIDEOS);
    return data;
};

/**
 * 유튜브 트렌드 영상을 keyword로 검색하여 최신순 8개를 반환하는 커스텀 훅
 * @param limit 반환할 영상 개수 (기본값: 8)
 * @returns videos: IYoutubeVideoItem[]
 */
export function useFetchYoutubeVideos(
    limit: number = 12
) {
    const { data, isError, error } = useSuspenseQuery({
        queryKey: youtubeQuery.all(),
        queryFn: async () => {
            const data = await fetchYoutubeVideos();
            return sortVideosByUpload(data, limit);
        },
    });

    return { videos: data, isError, error };
}