'use server';

import { apiClient } from '@/lib/api/apiClient';
import { EXTERNAL_PATHS } from '@/lib/api/paths';
import { ISituations } from '@/types/trends/situation';

/** 시황 데이터 조회 서버 엑션
 * @returns 시황 데이터
 */
export async function getSituation(): Promise<ISituations> {
    const data = await apiClient<ISituations>(EXTERNAL_PATHS.TRENDS.SITUATION);
    if (!data) throw new Error('시황 데이터 조회 중 에러');
    return data;
}