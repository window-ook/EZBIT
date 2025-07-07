import { ICandlesParams } from '@/types/exchange/candles';

export const candlesQuery = {
    all: () => ['candles'],
    detail: (params: ICandlesParams) => ['candles', params],
} as const;