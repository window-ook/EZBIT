'use client';

import { useContext, useMemo } from 'react';
import { TickerContext } from '@/providers/TickerProvider';
import { ITopCoins } from '@/types/upbit/topCoins';

/**
 * 시가총액 기반 TOP 코인 (근사치)
 * @description Upbit는 시가총액 데이터를 직접 제공하지 않으므로,
 * 24시간 거래대금이 높은 대형 코인들을 반환합니다.
 * 실제로는 BTC, ETH, XRP, SOL 등 메이저 코인이 상위권을 유지합니다.
 * @returns 거래대금 기반 대형주 TOP 5 (시가총액 근사치)
 */
export function useMarketCapTopCoins() {
    const { tickers, krwNames } = useContext(TickerContext);

    const isLoading = !tickers || Object.keys(tickers).length === 0;
    const error = null;

    const marketCapTopCoins = useMemo((): ITopCoins[] => {
        if (!tickers || Object.keys(tickers).length === 0) return [];

        // 거래대금 기반으로 정렬하여 대형주 추출
        // 실제로 BTC, ETH, XRP, SOL 등이 상위권
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

    return { marketCapTopCoins, isLoading, error };
}
