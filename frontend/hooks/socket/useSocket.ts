'use client';

import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

/** 실시간 현재가 정보 소켓 연결 훅
 * @returns {socket: Socket, subscribeMarket: (market: string) => void, unsubscribeMarket: (market: string) => void}
 */
export const useSocket = () => {
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        socketRef.current = io('http://localhost:4000', { transports: ['websocket', 'polling'] });

        // 연결 이벤트
        socketRef.current.on('connect', () => console.log('✅ Socket.IO 연결 성공'));
        socketRef.current.on('disconnect', () => console.log('❌ Socket.IO 연결 해제'));
        socketRef.current.on('connect_error', (error) => console.error('❌ Socket.IO 연결 에러:', error));

        // 컴포넌트 언마운트 시 연결 해제
        return () => { if (socketRef.current) socketRef.current.disconnect(); };
    }, []);

    const subscribeMarket = useCallback((market: string) => {
        socketRef.current?.emit('subscribe-market', market);
    }, []);

    const unsubscribeMarket = useCallback((market: string) => {
        socketRef.current?.emit('unsubscribe-market', market);
    }, []);

    return {
        socket: socketRef.current,
        subscribeMarket,
        unsubscribeMarket
    };
};