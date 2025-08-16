'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useSocket } from '@/hooks/socket/useSocket';
import { IUpbitTrade } from '@/types/upbit/trade';

const MAX_TRADES_COUNT = 100;

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

    // 거래내역 업데이트 함수 (메모이제이션)
    const updateTrade = useCallback((data: IUpbitTrade) => {
        // 데이터 검증 및 현재 마켓 확인
        if (!data?.code || data.code !== currentMarketRef.current) return;

        // 중복 데이터 체크 (sequential_id + timestamp 기준)
        const isDuplicate = tradesBufferRef.current.some(trade =>
            trade.sequential_id === data.sequential_id &&
            trade.timestamp === data.timestamp
        );

        if (isDuplicate) return;

        // 효율적인 배열 업데이트 (prepend + slice)
        const newBuffer = [data, ...tradesBufferRef.current];

        // 최대 개수 제한 (slice보다 효율적인 방법)
        if (newBuffer.length > MAX_TRADES_COUNT) {
            newBuffer.length = MAX_TRADES_COUNT;
        }

        // 버퍼 업데이트
        tradesBufferRef.current = newBuffer;

        // 상태 업데이트 (배치 업데이트)
        setTrades(newBuffer);
    }, []);

    // 마켓 변경 시 거래내역 초기화 및 구독 관리
    useEffect(() => {
        if (!market || !socket) return;

        // 이전 마켓 구독 해제
        if (currentMarketRef.current && currentMarketRef.current !== market) {
            unsubscribeMarket(currentMarketRef.current);
        }

        // 현재 마켓 업데이트
        currentMarketRef.current = market;

        // 거래내역 초기화
        tradesBufferRef.current = [];
        setTrades([]);

        // 새 마켓 구독
        subscribeMarket(market);

        // 이벤트 리스너 등록
        socket.on('trade-update', updateTrade);

        return () => {
            socket.off('trade-update', updateTrade);
            if (currentMarketRef.current) {
                unsubscribeMarket(currentMarketRef.current);
            }
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