'use server';

import { apiClient } from '@/lib/api/apiClient';
import { EXTERNAL_PATHS } from '@/lib/api/paths';
import { ITopics } from '@/types/trends/topics';

/**
 * 토픽 뉴스 데이터 조회 서버 액션
 * @returns 토픽 뉴스 데이터
 */
export async function getTopics(): Promise<ITopics> {
    const data = await apiClient<ITopics>(EXTERNAL_PATHS.TRENDS.TOPICS);
    if (!data) throw new Error('토픽 뉴스 데이터 조회 중 에러');
    return data;
}