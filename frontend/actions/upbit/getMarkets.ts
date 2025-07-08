'use server';

import Upbit from '@/lib/api/upbit';

/** 업비트 REST API 종목 목록 조회
 * @returns KRW 종목 목록
 */
export async function getMarkets() {
    const upbit = new Upbit();
    const response = await upbit.markets();
    return response.filter(code => code.market.includes('KRW'));
}