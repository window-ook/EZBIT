'use client';

import React, { useEffect, useCallback, useRef } from 'react';
import { useSocket } from '@/hooks/socket/useSocket';
import { IUpbitTicker, ITicker } from '@/types/upbit/ticker';

interface IConnectTicker {
    markets: { market: string }[] | undefined;
    setTickers: React.Dispatch<React.SetStateAction<Record<string, ITicker>>>;
}

/** 실시간 현재가 데이터 구독 훅
 * @description 업비트 WebSocket에서 실시간 현재가 데이터를 구독하고 상태를 업데이트하는 최적화된 훅
 * @param markets 종목 코드 목록
 * @param setTickers 현재가 데이터 업데이트 함수
 */
export function useTickerSocket({ markets, setTickers }: IConnectTicker) {
    const { socket, subscribeMarket, unsubscribeMarket } = useSocket();
    const subscribedMarketsRef = useRef<Set<string>>(new Set());
    const setTickersRef = useRef(setTickers);

    // setTickers 함수 참조 업데이트
    useEffect(() => {
        setTickersRef.current = setTickers;
    }, [setTickers]);

    // 현재가 데이터 업데이트 함수 (메모이제이션)
    const updateTickers = useCallback((tickerData: IUpbitTicker) => {
        // 데이터 검증
        if (!tickerData?.code) {
            console.warn('⚠️ 잘못된 ticker 데이터 수신:', tickerData);
            return;
        }

        // 최적화된 ticker 객체 생성
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

        // 함수형 업데이트로 성능 최적화
        setTickersRef.current(prev => {
            // 이전 값과 동일하면 업데이트하지 않음
            const prevTicker = prev[tickerData.code];
            if (prevTicker &&
                prevTicker.trade_price === newTicker.trade_price &&
                prevTicker.signed_change_rate === newTicker.signed_change_rate) {
                return prev;
            }

            // 단일 프로퍼티만 업데이트 (spread 대신 Object.assign 사용)
            return Object.assign({}, prev, { [tickerData.code]: newTicker });
        });
    }, []);

    // 마켓 구독 관리
    useEffect(() => {
        if (!markets || !socket) {
            console.warn('⚠️ 마켓 데이터 또는 소켓이 없음:', { markets: !!markets, socket: !!socket });
            return;
        }

        const currentMarkets = new Set(markets.map(m => m.market));
        const previousMarkets = subscribedMarketsRef.current;

        // 새로 추가된 마켓 구독
        const marketsToSubscribe = [...currentMarkets].filter(market => !previousMarkets.has(market));
        // 제거된 마켓 구독 해제
        const marketsToUnsubscribe = [...previousMarkets].filter(market => !currentMarkets.has(market));

        console.log('📊 구독 상태 변경:', {
            전체마켓수: currentMarkets.size,
            추가할마켓: marketsToSubscribe.length,
            제거할마켓: marketsToUnsubscribe.length,
            추가목록: marketsToSubscribe,
            제거목록: marketsToUnsubscribe
        });

        // 효율적인 구독/해제
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

        // 초기 데이터 처리
        socket.on('initial-data', (data) => {
            console.log('🔥 초기 데이터 수신:', data);
            if (data.ticker && typeof data.ticker === 'object') {
                // 초기 ticker 데이터 설정
                const initialTickers: Record<string, ITicker> = {};
                Object.entries(data.ticker).forEach(([market, tickerData]: [string, any]) => {
                    if (tickerData && tickerData.code) {
                        initialTickers[market] = {
                            market: tickerData.code,
                            trade_price: tickerData.trade_price || 0,
                            prev_closing_price: tickerData.prev_closing_price || 0,
                            signed_change_rate: tickerData.signed_change_rate || 0,
                            signed_change_price: tickerData.signed_change_price || 0,
                            acc_trade_price_24h: tickerData.acc_trade_price_24h || 0,
                            acc_trade_volume_24h: tickerData.acc_trade_volume_24h || 0,
                            high_price: tickerData.high_price || 0,
                            low_price: tickerData.low_price || 0,
                            lowest_52_week_price: tickerData.lowest_52_week_price || 0,
                            highest_52_week_price: tickerData.highest_52_week_price || 0,
                        };
                    }
                });

                if (Object.keys(initialTickers).length > 0) {
                    setTickersRef.current(initialTickers);
                }
            }
        });

        return () => {
            socket.off('ticker-update', updateTickers);
            socket.off('initial-data');
            // 컴포넌트 언마운트 시 모든 구독 해제
            [...subscribedMarketsRef.current].forEach(market => {
                unsubscribeMarket(market);
            });
            subscribedMarketsRef.current.clear();
        };
    }, [markets, socket, subscribeMarket, unsubscribeMarket, updateTickers]);
}