'use client';

import React, { useEffect, useCallback, useRef } from 'react';
import { useSocket } from '@/hooks/socket/useSocket';
import { IUpbitTicker, ITicker } from '@/types/upbit/ticker';

interface IConnectTicker {
    markets: { market: string }[] | undefined;
    setTickers: React.Dispatch<React.SetStateAction<Record<string, ITicker>>>;
    initialTickers?: Record<string, ITicker>;
}

/** 실시간 현재가 웹소켓 구독 관리 훅
 * @description 업비트 REST API로 초기 데이터를 설정, 이후 WebSocket으로 실시간 업데이트
 * @param markets 종목 코드 목록
 * @param setTickers 현재가 데이터 업데이트 함수
 * @param initialTickers REST API로 가져온 초기 현재가 데이터
 */
export function useTickerSocket({ markets, setTickers, initialTickers }: IConnectTicker) {
    const { socket, subscribeMarket, unsubscribeMarket } = useSocket();

    const subscribedMarketsRef = useRef<Set<string>>(new Set());
    const setTickersRef = useRef(setTickers);
    const throttleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const pendingUpdatesRef = useRef<Record<string, ITicker>>({});

    useEffect(() => {
        setTickersRef.current = setTickers;
    }, [setTickers]);

    const flushPendingUpdates = useCallback(() => {
        const updates = { ...pendingUpdatesRef.current };
        if (Object.keys(updates).length === 0) return;

        pendingUpdatesRef.current = {};

        setTickersRef.current(prev => {
            const nextState = { ...prev };
            let hasChanges = false;

            for (const [market, newTicker] of Object.entries(updates)) {
                const prevTicker = prev[market];
                if (!prevTicker ||
                    prevTicker.trade_price !== newTicker.trade_price ||
                    prevTicker.signed_change_rate !== newTicker.signed_change_rate ||
                    prevTicker.acc_trade_price_24h !== newTicker.acc_trade_price_24h ||
                    prevTicker.high_price !== newTicker.high_price ||
                    prevTicker.low_price !== newTicker.low_price) {
                    nextState[market] = newTicker;
                    hasChanges = true;
                }
            }

            return hasChanges ? nextState : prev;
        });
    }, []);

    const updateTickers = useCallback((tickerData: IUpbitTicker) => {
        if (!tickerData?.code) return;

        const newTicker: ITicker = {
            market: tickerData.code,
            trade_price: tickerData.trade_price,
            prev_closing_price: tickerData.prev_closing_price,
            signed_change_rate: tickerData.signed_change_rate,
            signed_change_price: tickerData.signed_change_price,
            acc_trade_price_24h: tickerData.acc_trade_price_24h,
            acc_trade_volume_24h: tickerData.acc_trade_volume_24h,
            high_price: tickerData.high_price,
            low_price: tickerData.low_price,
            lowest_52_week_price: tickerData.lowest_52_week_price,
            highest_52_week_price: tickerData.highest_52_week_price,
        };

        pendingUpdatesRef.current[tickerData.code] = newTicker;
        if (throttleTimeoutRef.current) return;

        throttleTimeoutRef.current = setTimeout(() => {
            flushPendingUpdates();
            throttleTimeoutRef.current = null;
        }, 500);
    }, [flushPendingUpdates]);

    useEffect(() => {
        if (!markets || !socket) return;

        const currentMarkets = new Set(markets.map(m => m.market));
        const previousMarkets = subscribedMarketsRef.current;

        const marketsToSubscribe = [...currentMarkets].filter(market => !previousMarkets.has(market));
        const marketsToUnsubscribe = [...previousMarkets].filter(market => !currentMarkets.has(market));

        marketsToSubscribe.forEach(market => {
            subscribeMarket(market);
            previousMarkets.add(market);
        });

        marketsToUnsubscribe.forEach(market => {
            unsubscribeMarket(market);
            previousMarkets.delete(market);
        });

        socket.on('ticker-update', updateTickers);

        socket.on('initial-data', (data) => {
            if (initialTickers && Object.keys(initialTickers).length > 0) return;

            if (data.ticker && typeof data.ticker === 'object') {
                const webSocketInitialTickers: Record<string, ITicker> = {};
                Object.entries(data.ticker).forEach(([market, tickerData]: [string, unknown]) => {
                    if (tickerData && typeof tickerData === 'object' && 'code' in tickerData) {
                        const ticker = tickerData as IUpbitTicker;
                        webSocketInitialTickers[market] = {
                            market: ticker.code,
                            trade_price: ticker.trade_price || 0,
                            prev_closing_price: ticker.prev_closing_price || 0,
                            signed_change_rate: ticker.signed_change_rate || 0,
                            signed_change_price: ticker.signed_change_price || 0,
                            acc_trade_price_24h: ticker.acc_trade_price_24h || 0,
                            acc_trade_volume_24h: ticker.acc_trade_volume_24h || 0,
                            high_price: ticker.high_price || 0,
                            low_price: ticker.low_price || 0,
                            lowest_52_week_price: ticker.lowest_52_week_price || 0,
                            highest_52_week_price: ticker.highest_52_week_price || 0,
                        };
                    }
                });

                if (Object.keys(webSocketInitialTickers).length > 0) setTickersRef.current(webSocketInitialTickers);
            }
        });

        return () => {
            socket.off('ticker-update', updateTickers);
            socket.off('initial-data');

            if (throttleTimeoutRef.current) {
                clearTimeout(throttleTimeoutRef.current);
                throttleTimeoutRef.current = null;
            }

            const subscribedMarketsAtCleanup = [...previousMarkets];
            subscribedMarketsAtCleanup.forEach(market => unsubscribeMarket(market));
            previousMarkets.clear();
        };
    }, [markets, socket, subscribeMarket, unsubscribeMarket, updateTickers, initialTickers]);
}