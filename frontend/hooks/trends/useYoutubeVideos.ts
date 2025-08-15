'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { youtubeQuery } from '@/queries/trends/youtubeVideos.query';
import { sortByUploadDate } from '@/utils/shared/date';
import { IYoutubeVideosResponse } from '@/types/trends/youtubeVideos';

const TWO_HOURS = 2 * 60 * 60 * 1000;

/** 유튜브 트렌드 영상을 keyword로 검색하여 최신순 12개를 반환하는 훅
 * @param limit 반환할 영상 개수 (기본값: 12)
 * @returns videos: IYoutubeVideoItem[]
 */
export function useYoutubeVideos(
    limit: number = 12
) {
    /**
     * 라우트 핸들러를 통해 유튜브 비디오 데이터를 가져옵니다.
     * @returns Promise<IYoutubeVideoItem[]>
     */
    const fetchYoutubeVideos = async () => {
        const response = await fetch('/api/youtube-videos?keyword=비트코인&maxResults=8');
        
        if (!response.ok) {
            throw new Error('유튜브 비디오 데이터를 가져오는데 실패했습니다.');
        }
        
        const result = await response.json();
        const data: IYoutubeVideosResponse = result.data;
        return sortByUploadDate(data, limit);
    };

    const { data, isError, error } = useSuspenseQuery({
        queryKey: youtubeQuery.all(),
        queryFn: fetchYoutubeVideos,
        staleTime: TWO_HOURS,
        gcTime: TWO_HOURS * 2,
    });

    return { videos: data, isError, error };
}