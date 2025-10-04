'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useSocket } from '@/hooks/socket/useSocket';
import { IUpbitOrderbook } from '@/types/upbit/orderbook';

/** 
 * 실시간 오더북 웹소켓 구독 관리 훅
 * @param market 종목 코드
 * @returns {orderbook: IUpbitOrderbook | null}
 */
export function useOrderbookSocket(market: string) {
    const [orderbook, setOrderbook] = useState<IUpbitOrderbook | null>(null);
    const { socket, subscribeMarket, unsubscribeMarket } = useSocket();

    const currentMarketRef = useRef<string>('');
    const lastUpdateTimeRef = useRef<number>(0);

    const updateOrderbook = useCallback((data: IUpbitOrderbook) => {
        if (!data?.code || data.code !== currentMarketRef.current) return;

        const currentTime = data.timestamp || Date.now();
        if (currentTime - lastUpdateTimeRef.current < 500) return;
        lastUpdateTimeRef.current = currentTime;
        if (!data.orderbook_units || !Array.isArray(data.orderbook_units)) return;

        const optimizedOrderbook: IUpbitOrderbook = {
            code: data.code,
            timestamp: data.timestamp,
            total_ask_size: data.total_ask_size,
            total_bid_size: data.total_bid_size,
            orderbook_units: data.orderbook_units.map(unit => ({
                ask_price: unit.ask_price,
                bid_price: unit.bid_price,
                ask_size: unit.ask_size,
                bid_size: unit.bid_size
            }))
        };

        setOrderbook(optimizedOrderbook);
    }, []);

    useEffect(() => {
        if (!market || !socket) return;
        if (currentMarketRef.current && currentMarketRef.current !== market) unsubscribeMarket(currentMarketRef.current);
        currentMarketRef.current = market;
        setOrderbook(null);
        lastUpdateTimeRef.current = 0;
        subscribeMarket(market);
        socket.on('orderbook-update', updateOrderbook);

        return () => {
            socket.off('orderbook-update', updateOrderbook);
            if (currentMarketRef.current) unsubscribeMarket(currentMarketRef.current);
        };
    }, [market, socket, subscribeMarket, unsubscribeMarket, updateOrderbook]);

    return { orderbook };
}