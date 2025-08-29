'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useSocket } from '@/hooks/socket/useSocket';
import { IUpbitTrade } from '@/types/upbit/trade';

const MAX_TRADES_COUNT = 50;
const THROTTLE_MS = 500;

/** 실시간 거래내역 데이터 구독 훅
 * @description 업비트 WebSocket에서 실시간 거래 체결 데이터를 구독하고 순환 버퍼로 관리하는 최적화된 훅
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

    // 쓰로틀링된 업데이트 실행 함수
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

    // 거래내역 업데이트 함수
    const updateTrade = useCallback((data: IUpbitTrade) => {
        if (!data?.code || data.code !== currentMarketRef.current) return;
        pendingTradesRef.current.push(data);
        if (throttleTimeoutRef.current) return;

        throttleTimeoutRef.current = setTimeout(() => {
            flushPendingTrades();
            throttleTimeoutRef.current = null;
        }, THROTTLE_MS);
    }, [flushPendingTrades]);

    // 마켓 변경 시 거래내역 초기화 및 구독 관리
    useEffect(() => {
        if (!market || !socket) return;

        // 이전 마켓 구독 해제
        if (currentMarketRef.current && currentMarketRef.current !== market) unsubscribeMarket(currentMarketRef.current);

        // 현재 마켓 업데이트
        currentMarketRef.current = market;

        // 거래내역 초기화
        tradesBufferRef.current = [];
        pendingTradesRef.current = [];
        if (throttleTimeoutRef.current) {
            clearTimeout(throttleTimeoutRef.current);
            throttleTimeoutRef.current = null;
        }
        setTrades([]);

        // 새 마켓 구독
        subscribeMarket(market);

        // 이벤트 리스너 등록
        socket.on('trade-update', updateTrade);

        return () => {
            socket.off('trade-update', updateTrade);
            if (currentMarketRef.current) unsubscribeMarket(currentMarketRef.current);
        };
    }, [market, socket, subscribeMarket, unsubscribeMarket, updateTrade]);

    // 마켓 변경 시 거래내역 리셋
    useEffect(() => {
        if (currentMarketRef.current !== market) {
            tradesBufferRef.current = [];
            setTrades([]);
        }
    }, [market]);

    return { trades };
}