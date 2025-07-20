'use client';

import { useEffect, useState } from 'react';
import { useSocket } from '@/hooks/socket/useSocket';
import { IUpbitOrderbook } from '@/types/upbit/orderbook';

/** 실시간 오더북 데이터 구독 훅
 * @param market 종목 코드
 * @returns {orderbook: IUpbitOrderbook | null}
 */
export function useOrderbookSocket(market: string) {
    const [orderbook, setOrderbook] = useState<IUpbitOrderbook | null>(null);

    const { socket, subscribeMarket, unsubscribeMarket } = useSocket();

    useEffect(() => {
        if (!market) return;

        subscribeMarket(market);

        const updateOrderbook = (data: IUpbitOrderbook) => {
            if (data.code === market) setOrderbook(data);
        };

        socket?.on('orderbook-update', updateOrderbook);

        return () => {
            socket?.off('orderbook-update', updateOrderbook);
            unsubscribeMarket(market);
        };
    }, [market, socket, subscribeMarket, unsubscribeMarket]);

    return { orderbook };
}