import { NextRequest } from 'next/server';
import { createErrorResponse, createSuccessResponse, getQueryParam } from '@/lib/api/routeHandlerUtils';
import { fetchYoutubeVideos } from '@/lib/data/fetchYoutubeVideos';

/**
 * 유튜브 비디오 검색 데이터 조회
 * @param request - Next.js Request 객체
 * @returns 유튜브 비디오 데이터 또는 에러 응답
 */
export async function GET(request: NextRequest) {
  try {
    const keyword = getQueryParam(request, 'keyword', true);

    if (!keyword) return createErrorResponse('검색 키워드가 필요합니다.', 400);

    const maxResults = getQueryParam(request, 'maxResults') || '8';

    const data = await fetchYoutubeVideos({ keyword, maxResults });

    if (!data) return createErrorResponse('유튜브 비디오 데이터 조회 중 에러가 발생했습니다.');

    return createSuccessResponse(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : '유튜브 비디오 데이터를 가져오는데 실패했습니다.';
    return createErrorResponse(message);
  }
}