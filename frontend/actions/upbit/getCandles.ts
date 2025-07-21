'use server';

import { IUpbitCandleQueryParams } from '@/types/upbit/candle';
import Upbit from '@/lib/api/upbit';

/**
 * 업비트 REST API 캔들 데이터 조회 서버 액션
 * @param params - 캔들 조회 파라미터
 * @returns 캔들 데이터
 * @memo 캔들 데이터는 웹소켓이 베타이면서, 일/주/월/년 캔들을 제공하지 않아 REST API로 조회
 */
export async function getCandles(params: IUpbitCandleQueryParams) {
    const { type = '', ticker = '', count = 0, unit, to } = params;

    const upbit = new Upbit();

    switch (type) {
        case '1min':
        case '5min':
            if (!unit) throw new Error('unit(몇 분)을 입력하세요.');
            return await upbit.candleMinutes(unit, ticker, count, to);
        case 'days':
            return await upbit.candleDays(ticker, count);
        case 'day':
            return await upbit.candleDays(ticker, count, to);
        case 'weeks':
            return await upbit.candleWeeks(ticker, count);
        case 'months':
            return await upbit.candleMonths(ticker, count);
        default:
            throw new Error('유효하지 않은 타입입니다.');
    }
}