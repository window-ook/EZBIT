'use client';

import { useContext, useMemo } from 'react';
import { TickerContext } from '@/providers/TickerProvider';
import { ITopCoins } from '@/types/upbit/topCoins';
import {
    calculateTopRisedCoins,
    calculateTradingVolumeTopCoins
} from '@/utils/shared/calculateTopCoins';

/**
 * 실시간 상승률 TOP 10, 24시간 거래대금 TOP 5 계산 훅
 */
export function useTickerBasedTopCoins() {
    const { tickers, krwNames } = useContext(TickerContext);

    const isLoading = !tickers || Object.keys(tickers).length === 0;

    // 실시간 상승률 TOP 10
    const todayTopRisedCoins = useMemo((): ITopCoins[] => {
        if (!tickers || Object.keys(tickers).length === 0) return [];
        return calculateTopRisedCoins(tickers, krwNames);
    }, [tickers, krwNames]);

    // 24시간 거래대금 TOP 5
    const tradingVolumeTopCoins = useMemo((): ITopCoins[] => {
        if (!tickers || Object.keys(tickers).length === 0) return [];
        return calculateTradingVolumeTopCoins(tickers, krwNames);
    }, [tickers, krwNames]);

    return { todayTopRisedCoins, tradingVolumeTopCoins, isLoading, error: null };
} 