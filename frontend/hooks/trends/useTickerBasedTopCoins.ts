'use client';

import { useContext, useMemo } from 'react';
import { TickerContext } from '@/providers/TickerProvider';
import { ITopCoins } from '@/types/upbit/topCoins';

/**
 * TickerProvider 기반 실시간 TOP 코인 훅
 * @returns 실시간 상승률 TOP 10, 24시간 거래대금 TOP 5, 로딩 상태, 에러 상태
 */
export function useTickerBasedTopCoins() {
    const { tickers, krwNames } = useContext(TickerContext);

    const isLoading = !tickers || Object.keys(tickers).length === 0;
    const error = null;

    // 실시간 상승률 TOP 10
    const todayTopRisedCoins = useMemo((): ITopCoins[] => {
        if (!tickers || Object.keys(tickers).length === 0) return [];

        return Object.values(tickers)
            .filter(ticker => ticker.market.startsWith('KRW-'))
            .sort((a, b) => b.signed_change_rate - a.signed_change_rate)
            .slice(0, 10)
            .map((ticker, index) => ({
                rank: index + 1,
                name: krwNames[ticker.market] || ticker.market.replace('KRW-', ''),
                code: ticker.market.replace('KRW-', '') + '/KRW',
                rate: parseFloat((ticker.signed_change_rate * 100).toFixed(2))
            }));
    }, [tickers, krwNames]);

    // 24시간 거래대금 TOP 5
    const tradingVolumeTopCoins = useMemo((): ITopCoins[] => {
        if (!tickers || Object.keys(tickers).length === 0) return [];

        return Object.values(tickers)
            .filter(ticker => ticker.market.startsWith('KRW-'))
            .sort((a, b) => b.acc_trade_price_24h - a.acc_trade_price_24h)
            .slice(0, 5)
            .map((ticker, index) => ({
                rank: index + 1,
                name: krwNames[ticker.market] || ticker.market.replace('KRW-', ''),
                code: ticker.market.replace('KRW-', '') + '/KRW',
                rate: parseFloat((ticker.signed_change_rate * 100).toFixed(2))
            }));
    }, [tickers, krwNames]);

    return { todayTopRisedCoins, tradingVolumeTopCoins, isLoading, error };
} 