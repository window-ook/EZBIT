'use server';

import { apiClient } from '@/lib/api/apiClient';
import { EXTERNAL_PATHS } from '@/lib/api/paths';
import { IRisedCoins } from '@/types/trends/risedCoins';

/**
 * 기간별 상승률 데이터 조회 서버 액션
 * @returns 기간별 상승률 데이터
 */
export async function getRisedCoins(): Promise<IRisedCoins> {
    const data = await apiClient<IRisedCoins>(EXTERNAL_PATHS.TRENDS.RISED_COINS);
    if (!data) throw new Error('기간별 상승률 데이터 조회 중 에러');
    return data;
}