import { apiClient } from '@/lib/api/apiClient';
import { EXTERNAL_PATHS } from '@/lib/api/paths';
import { IYoutubeVideosResponse } from '@/types/trends/youtubeVideos';

interface IYoutubeSearchParams {
  keyword: string;
  maxResults?: string;
}

/** 유튜브 데이터 페칭 함수 */
export async function fetchYoutubeVideos({ keyword, maxResults = '8' }: IYoutubeSearchParams): Promise<IYoutubeVideosResponse> {
  const params = new URLSearchParams({
    part: 'snippet',
    type: 'video',
    q: keyword,
    key: process.env.GOOGLE_API_KEY || '',
    maxResults,
  });

  const data = await apiClient<IYoutubeVideosResponse>(`${EXTERNAL_PATHS.YOUTUBE_VIDEOS}?${params.toString()}`, { next: { revalidate: 3600 } }, 'external');
  return data;
};