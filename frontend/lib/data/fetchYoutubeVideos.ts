import { apiClient } from '@/lib/api/apiClient';
import { EXTERNAL_PATHS } from '@/lib/api/paths';
import { IYoutubeVideosResponse } from '@/types/trends/youtubeVideos';

export interface IYoutubeSearchParams {
  keyword: string;
  maxResults?: string;
}

export const fetchYoutubeVideos = async ({ keyword, maxResults = '8' }: IYoutubeSearchParams): Promise<IYoutubeVideosResponse> => {
  const params = new URLSearchParams({
    part: 'snippet',
    maxResults,
    type: 'video',
    q: keyword,
    key: process.env.GOOGLE_API_KEY || '',
  });

  const data = await apiClient<IYoutubeVideosResponse>(
    `${EXTERNAL_PATHS.TRENDS.YOUTUBE_VIDEOS}?${params.toString()}`,
    { next: { revalidate: 3600 } },
    'external'
  );

  return data;
};