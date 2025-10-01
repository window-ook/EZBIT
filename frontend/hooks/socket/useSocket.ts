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
            reconnectionAttempts: 10, // 재연결 시도 횟수 증가
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000, // 최대 재연결 지연 시간
            timeout: 20000, // 연결 타임아웃
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
            console.error('❌ Socket.IO 연결 에러:', error.message || error);
            console.warn('🔧 웹소켓 서버(port:4000)가 실행 중인지 확인하세요');
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

        // 정리 함수 - 메모리 누수 방지
        return () => {
            if (socketRef.current) {
                socketRef.current.off('connect', handleConnect);
                socketRef.current.off('disconnect', handleDisconnect);
                socketRef.current.off('connect_error', handleConnectError);
                socketRef.current.off('reconnect', handleReconnect);
                socketRef.current.off('reconnect_attempt', handleReconnectAttempt);
                socketRef.current.off('reconnect_error', handleReconnectError);
                socketRef.current.disconnect();
                socketRef.current = null;
            }
            setIsConnected(false);
        };
    }, []);

    // 마켓 구독 함수
    const subscribeMarket = useCallback((market: string) => {
        if (!market) return;
        if (socketRef.current?.connected) {
            socketRef.current.emit('subscribe-market', market);
        } else {
            console.warn('⚠️ 소켓이 연결되지 않아 구독 요청 실패:', market);
        }
    }, []);

    // 마켓 구독 해제 함수
    const unsubscribeMarket = useCallback((market: string) => {
        if (!market) return;
        if (socketRef.current?.connected) {
            socketRef.current.emit('unsubscribe-market', market);
        } else {
            console.warn('⚠️ 소켓이 연결되지 않아 구독 해제 요청 실패:', market);
        }
    }, []);

    // 반환값 최적화 - 소켓 객체는 의존성에서 제외
    return useMemo(() => ({
        socket: socketRef.current,
        subscribeMarket,
        unsubscribeMarket,
        isConnected
    }), [subscribeMarket, unsubscribeMarket, isConnected]);
};