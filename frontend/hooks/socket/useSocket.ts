'use client';

import { useEffect, useRef, useCallback, useMemo, useState } from 'react';
import { io, Socket } from 'socket.io-client';

/** 실시간 현재가 정보 소켓 연결 훅
 * @description 소켓 연결 관리와 마켓 구독/해제 기능을 제공하는 최적화된 훅
 * @returns {socket: Socket, subscribeMarket: (market: string) => void, unsubscribeMarket: (market: string) => void}
 */
export const useSocket = () => {
    const socketRef = useRef<Socket | null>(null);
    const [isConnected, setIsConnected] = useState<boolean>(false);

    // 소켓 연결 및 이벤트 리스너 설정
    useEffect(() => {
        // 이미 연결되어 있으면 중복 연결 방지
        if (socketRef.current?.connected) return;

        const socket = io(process.env.NEXT_PUBLIC_WEBSOCKET_SERVER || 'http://localhost:4000', {
            transports: ['websocket', 'polling'],
            forceNew: false,
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        socketRef.current = socket;

        // 연결 상태 관리
        const handleConnect = () => {
            console.log('✅ Socket.IO 연결 성공');
            console.log('📡 Socket 연결 상태:', socket.connected);
            setIsConnected(true);
        };

        const handleDisconnect = (reason: string) => {
            console.log('❌ Socket.IO 연결 해제');
            console.log('📄 연결 해제 이유:', reason);
            console.log('📡 Socket 연결 상태:', socket.connected);
            setIsConnected(false);
        };

        const handleConnectError = (error: Error) => {
            console.error('❌ Socket.IO 연결 에러:', error);
            console.log('📡 Socket 연결 상태:', socket.connected);
            setIsConnected(false);
        };

        const handleReconnect = (attemptNumber: number) => {
            console.log('🔄 Socket.IO 재연결 성공');
            console.log('🔢 재연결 시도 횟수:', attemptNumber);
        };

        const handleReconnectAttempt = (attemptNumber: number) => {
            console.log('🔄 Socket.IO 재연결 시도 중...');
            console.log('🔢 시도 횟수:', attemptNumber);
        };

        const handleReconnectError = (error: Error) => {
            console.error('❌ Socket.IO 재연결 에러:', error);
        };

        // 이벤트 리스너 등록
        socket.on('connect', handleConnect);
        socket.on('disconnect', handleDisconnect);
        socket.on('connect_error', handleConnectError);
        socket.on('reconnect', handleReconnect);
        socket.on('reconnect_attempt', handleReconnectAttempt);
        socket.on('reconnect_error', handleReconnectError);

        // 정리 함수
        return () => {
            socket.off('connect', handleConnect);
            socket.off('disconnect', handleDisconnect);
            socket.off('connect_error', handleConnectError);
            socket.off('reconnect', handleReconnect);
            socket.off('reconnect_attempt', handleReconnectAttempt);
            socket.off('reconnect_error', handleReconnectError);
            socket.disconnect();
            setIsConnected(false);
        };
    }, []);

    // 마켓 구독 함수 (메모이제이션)
    const subscribeMarket = useCallback((market: string) => {
        if (!market) return;
        if (socketRef.current?.connected) {
            socketRef.current.emit('subscribe-market', market);
        } else {
            console.warn('⚠️ 소켓이 연결되지 않아 구독 요청 실패:', market);
        }
    }, []);

    // 마켓 구독 해제 함수 (메모이제이션)
    const unsubscribeMarket = useCallback((market: string) => {
        if (!market) return;
        if (socketRef.current?.connected) {
            socketRef.current.emit('unsubscribe-market', market);
        } else {
            console.warn('⚠️ 소켓이 연결되지 않아 구독 해제 요청 실패:', market);
        }
    }, []);

    // 반환값 메모이제이션
    const returnValue = useMemo(() => ({
        socket: socketRef.current,
        subscribeMarket,
        unsubscribeMarket,
        isConnected
    }), [subscribeMarket, unsubscribeMarket, isConnected]);

    return returnValue;
};