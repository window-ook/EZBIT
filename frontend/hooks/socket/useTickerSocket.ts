'use client';

import React, { useEffect, useCallback, useRef } from 'react';
import { useSocket } from '@/hooks/socket/useSocket';
import { IUpbitTicker, ITicker } from '@/types/upbit/ticker';

interface IConnectTicker {
    markets: { market: string }[] | undefined;
    setTickers: React.Dispatch<React.SetStateAction<Record<string, ITicker>>>;
    initialTickers?: Record<string, ITicker>;
}

/** 실시간 현재가 데이터 구독 훅 (REST API + WebSocket)
 * @description REST API로 초기 데이터를 설정하고, WebSocket으로 실시간 업데이트하는 최적화된 훅
 * @param markets 종목 코드 목록
 * @param setTickers 현재가 데이터 업데이트 함수
 * @param initialTickers REST API로 가져온 초기 현재가 데이터 (선택사항)
 */
export function useTickerSocket({ markets, setTickers, initialTickers }: IConnectTicker) {
    const { socket, subscribeMarket, unsubscribeMarket } = useSocket();
    const subscribedMarketsRef = useRef<Set<string>>(new Set());
    const setTickersRef = useRef(setTickers);

    // 쓰로틀링을 위한 refs
    const throttleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const pendingUpdatesRef = useRef<Record<string, ITicker>>({});

    useEffect(() => {
        setTickersRef.current = setTickers;
    }, [setTickers]);

    // 쓰로틀링된 업데이트 실행 함수
    const flushPendingUpdates = useCallback(() => {
        const updates = { ...pendingUpdatesRef.current };
        if (Object.keys(updates).length === 0) return;

        pendingUpdatesRef.current = {};

        setTickersRef.current(prev => {
            const nextState = { ...prev };
            let hasChanges = false;

            for (const [market, newTicker] of Object.entries(updates)) {
                const prevTicker = prev[market];
                // 더 상세한 비교로 불필요한 업데이트 방지
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

    // 500ms 쓰로틀링된 현재가 데이터 업데이트 함수
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

        // 펜딩 업데이트에 추가 (최신 데이터로 덮어쓰기)
        pendingUpdatesRef.current[tickerData.code] = newTicker;

        // 쓰로틀링: 500ms마다 한 번씩만 실행
        if (throttleTimeoutRef.current) return;

        throttleTimeoutRef.current = setTimeout(() => {
            flushPendingUpdates();
            throttleTimeoutRef.current = null;
        }, 500);
    }, [flushPendingUpdates]);

    // 마켓 구독 관리
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

        // 소켓 이벤트 리스너 등록
        socket.on('ticker-update', updateTickers);

        // REST로 불러온 데이터가 없으면 WebSocket 초기 데이터 처리
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
            const subscribedMarketsAtCleanup = [...previousMarkets];
            subscribedMarketsAtCleanup.forEach(market => unsubscribeMarket(market));
            previousMarkets.clear();
        };
    }, [markets, socket, subscribeMarket, unsubscribeMarket, updateTickers, initialTickers]);
}