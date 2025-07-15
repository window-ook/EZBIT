'use server';

import { apiClient } from '@/lib/api/apiClient';
import { EXTERNAL_PATHS } from '@/lib/api/paths';
import { IRisedCoin } from '@/types/trends/risedCoins';

/**
 * 기간별 상승률 데이터 조회 서버 액션
 * @returns 기간별 상승률 데이터
 * @throws 에러 메세지 (실패 시)
 */
export async function getRisedCoins(): Promise<IRisedCoin[]> {
    const data = await apiClient<IRisedCoin[]>(EXTERNAL_PATHS.TRENDS.RISED_COINS);
    if (!data) throw new Error('기간별 상승률 데이터 조회 중 에러');
    return data;
}