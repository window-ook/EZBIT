'use client';

import { useContext, useMemo } from 'react';
import { TickerContext } from '@/providers/TickerProvider';
import { ITopCoins } from '@/types/upbit/topCoins';

/**
 * TickerProvider 기반 실시간 TOP 코인 훅
 * @description 크롤링 없이 실시간 ticker 데이터를 활용하여 TOP 코인들을 계산
 * @returns 오늘 상승률 TOP 10, 24시간 거래대금 TOP 5
 */
export function useTickerBasedTopCoins() {
    const { tickers, krwNames } = useContext(TickerContext);

    // 오늘 상승률 TOP 10 (signed_change_rate 기준)
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
                rate: parseFloat((ticker.signed_change_rate * 100).toFixed(2)) // %로 변환
            }));
    }, [tickers, krwNames]);

    // 24시간 거래대금 TOP 5 (acc_trade_price_24h 기준)
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
                rate: parseFloat((ticker.signed_change_rate * 100).toFixed(2)) // 변화율도 함께 표시
            }));
    }, [tickers, krwNames]);

    return { todayTopRisedCoins, tradingVolumeTopCoins };
} 