'use server';

import { apiClient } from '@/lib/api/apiClient';
import { EXTERNAL_PATHS } from '@/lib/api/paths';
import { IYoutubeVideosResponse } from '@/types/trends/video';

/**
 * 유튜브 트렌드 영상 데이터 조회 서버 액션
 * @returns 유튜브 트렌드 영상 데이터
 * @throws 에러 메세지 (실패 시)
 */
export async function getYoutubeVideos(): Promise<IYoutubeVideosResponse> {
    const data = await apiClient<IYoutubeVideosResponse>(EXTERNAL_PATHS.TRENDS.YOUTUBE_VIDEOS);
    if (!data) throw new Error('유튜브 트렌드 영상 데이터 조회 중 에러');
    return data;
}