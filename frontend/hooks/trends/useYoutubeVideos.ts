'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { youtubeQuery } from '@/queries/trends/youtubeVideos.query';
import { sortByUploadDate } from '@/utils/shared/date';
import { getYoutubeVideos } from '@/actions/trends/getYoutubeVideos';

const TWO_HOURS = 2 * 60 * 60 * 1000;

/** 유튜브 트렌드 영상을 keyword로 검색하여 최신순 12개를 반환하는 훅
 * @param limit 반환할 영상 개수 (기본값: 12)
 * @returns videos: IYoutubeVideoItem[]
 */
export function useYoutubeVideos(
    limit: number = 12
) {
    const { data, isError, error } = useSuspenseQuery({
        queryKey: youtubeQuery.all(),
        queryFn: async () => {
            const data = await getYoutubeVideos('비트코인');
            return sortByUploadDate(data, limit);
        },
        staleTime: TWO_HOURS,
        gcTime: TWO_HOURS * 2,
    });

    return { videos: data, isError, error };
}