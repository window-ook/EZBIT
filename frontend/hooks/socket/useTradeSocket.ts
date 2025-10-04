'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useSocket } from '@/hooks/socket/useSocket';
import { IUpbitTrade } from '@/types/upbit/trade';

const MAX_TRADES_COUNT = 50;
const THROTTLE_MS = 500;

/** 
 * 실시간 거래 내역 웹소켓 구독 관리 훅
 * @param market 종목 코드
 * @returns {trades: IUpbitTrade[]}
 */
export function useTradeSocket(market: string) {
    const [trades, setTrades] = useState<IUpbitTrade[]>([]);
    const { socket, subscribeMarket, unsubscribeMarket } = useSocket();

    const currentMarketRef = useRef<string>('');
    const tradesBufferRef = useRef<IUpbitTrade[]>([]);
    const pendingTradesRef = useRef<IUpbitTrade[]>([]);
    const throttleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const flushPendingTrades = useCallback(() => {
        if (pendingTradesRef.current.length === 0) return;

        const seenIds = new Set<number>();
        const uniqueTrades = pendingTradesRef.current.filter(trade => {
            if (seenIds.has(trade.sequential_id)) return false;
            seenIds.add(trade.sequential_id);
            return true;
        }).reverse();

        const mergedTrades = [...uniqueTrades, ...tradesBufferRef.current].slice(0, MAX_TRADES_COUNT);

        tradesBufferRef.current = mergedTrades;
        pendingTradesRef.current = [];
        setTrades([...mergedTrades]);
    }, []);

    const updateTrade = useCallback((data: IUpbitTrade) => {
        if (!data?.code || data.code !== currentMarketRef.current) return;
        pendingTradesRef.current.push(data);
        if (throttleTimeoutRef.current) return;

        throttleTimeoutRef.current = setTimeout(() => {
            flushPendingTrades();
            throttleTimeoutRef.current = null;
        }, THROTTLE_MS);
    }, [flushPendingTrades]);

    useEffect(() => {
        if (!market || !socket) return;

        if (currentMarketRef.current && currentMarketRef.current !== market) unsubscribeMarket(currentMarketRef.current);

        currentMarketRef.current = market;

        tradesBufferRef.current = [];
        pendingTradesRef.current = [];
        if (throttleTimeoutRef.current) {
            clearTimeout(throttleTimeoutRef.current);
            throttleTimeoutRef.current = null;
        }
        setTrades([]);

        subscribeMarket(market);

        socket.on('trade-update', updateTrade);

        return () => {
            socket.off('trade-update', updateTrade);
            if (currentMarketRef.current) unsubscribeMarket(currentMarketRef.current);
        };
    }, [market, socket, subscribeMarket, unsubscribeMarket, updateTrade]);

    return { trades };
}