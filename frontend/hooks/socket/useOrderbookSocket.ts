'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useSocket } from '@/hooks/socket/useSocket';
import { IUpbitOrderbook } from '@/types/upbit/orderbook';

/** 실시간 오더북 데이터 구독 훅
 * @description 업비트 WebSocket에서 실시간 호가 데이터를 구독하고 관리하는 최적화된 훅
 * @param market 종목 코드
 * @returns {orderbook: IUpbitOrderbook | null}
 */
export function useOrderbookSocket(market: string) {
    const [orderbook, setOrderbook] = useState<IUpbitOrderbook | null>(null);
    const { socket, subscribeMarket, unsubscribeMarket } = useSocket();
    
    const currentMarketRef = useRef<string>('');
    const lastUpdateTimeRef = useRef<number>(0);

    // 오더북 업데이트 함수 (메모이제이션)
    const updateOrderbook = useCallback((data: IUpbitOrderbook) => {
        // 데이터 검증 및 현재 마켓 확인
        if (!data?.code || data.code !== currentMarketRef.current) return;

        // 중복 업데이트 방지 (timestamp 기준)
        const currentTime = data.timestamp || Date.now();
        if (currentTime <= lastUpdateTimeRef.current) return;
        
        lastUpdateTimeRef.current = currentTime;

        // 오더북 데이터 유효성 검증
        if (!data.orderbook_units || !Array.isArray(data.orderbook_units)) return;

        // 데이터 구조 최적화 (필요한 필드만 추출)
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

    // 마켓 변경 시 오더북 초기화 및 구독 관리
    useEffect(() => {
        if (!market || !socket) return;

        // 이전 마켓 구독 해제
        if (currentMarketRef.current && currentMarketRef.current !== market) {
            unsubscribeMarket(currentMarketRef.current);
        }

        // 현재 마켓 업데이트
        currentMarketRef.current = market;

        // 오더북 초기화
        setOrderbook(null);
        lastUpdateTimeRef.current = 0;

        // 새 마켓 구독
        subscribeMarket(market);

        // 이벤트 리스너 등록
        socket.on('orderbook-update', updateOrderbook);

        return () => {
            socket.off('orderbook-update', updateOrderbook);
            if (currentMarketRef.current) {
                unsubscribeMarket(currentMarketRef.current);
            }
        };
    }, [market, socket, subscribeMarket, unsubscribeMarket, updateOrderbook]);

    // 마켓 변경 시 오더북 리셋
    useEffect(() => {
        if (currentMarketRef.current !== market) {
            setOrderbook(null);
            lastUpdateTimeRef.current = 0;
        }
    }, [market]);

    return { orderbook };
}