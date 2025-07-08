'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { youtubeQuery } from '@/queries/trends/youtube.query';
import { sortVideosByUpload } from '@/utils/trends/sortVideosByUpload';
import { getYoutubeVideos } from '@/actions/trends/getYoutubeVideos';

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
            const data = await getYoutubeVideos();
            return sortVideosByUpload(data, limit);
        },
    });

    return { videos: data, isError, error };
}