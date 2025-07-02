'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { youtubeQuery } from '@/queries/trends/youtube.query';
import { IYoutubeVideosResponse } from '@/types/trends/video';
import { sortVideosByUpload } from '@/utils/trends/sortVideosByUpload';

const fetchYoutubeVideos = async (): Promise<IYoutubeVideosResponse> => {
    try {
        const res = await fetch('/api/trends/youtube-videos');
        const data: IYoutubeVideosResponse = await res.json();
        return data;
    } catch {
        return { kind: '', etag: '', items: [] };
    }
};

/**
 * 유튜브 트렌드 영상을 keyword로 검색하여 최신순 8개를 반환하는 커스텀 훅
 * @param keyword 검색 키워드 (기본값: '코인 근황')
 * @param limit 반환할 영상 개수 (기본값: 8)
 * @returns videos: IYoutubeVideoItem[]
 */
export function useFetchYoutubeVideos(
    limit: number = 8
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