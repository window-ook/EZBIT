import { IUpbitCandleQueryParams } from '@/types/upbit/candle';

export const candlesQuery = {
    all: () => ['candles'],
    detail: (params: IUpbitCandleQueryParams) => ['candles', params],
} as const;