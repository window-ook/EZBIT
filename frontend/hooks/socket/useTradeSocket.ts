'use client';

import { useEffect, useState } from 'react';
import { useSocket } from '@/hooks/socket/useSocket';
import type { IUpbitTrade } from '@/types/upbit/trade';

/**
 * @description 실시간 거래내역(체결) 데이터 구독 훅
 * @param market 종목 코드
 * @returns {trades: IUpbitTrade[]}
 */
export function useTradeSocket(market: string) {
    const [trades, setTrades] = useState<IUpbitTrade[]>([]);

    const { socket, subscribeMarket, unsubscribeMarket } = useSocket();

    useEffect(() => {
        if (!market) return;

        subscribeMarket(market);

        const updateTrade = (data: IUpbitTrade) => {
            if (data.code === market) setTrades(prev => [data, ...prev].slice(0, 100));
        };
        socket?.on('trade-update', updateTrade);

        return () => {
            socket?.off('trade-update', updateTrade);
            unsubscribeMarket(market);
        };
    }, [market, socket, subscribeMarket, unsubscribeMarket]);

    return { trades };
}