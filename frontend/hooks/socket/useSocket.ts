'use client';

import { CONSOLE_ERROR, CONSOLE_WARN, CONSOLE_LOG } from '@/constants/messages';
import { useEffect, useRef, useCallback, useMemo, useState } from 'react';
import { io, Socket } from 'socket.io-client';

/** 
 * 실시간 현재가 정보 소켓 연결 훅
 * @description 소켓 연결 관리와 마켓 구독/해제 기능을 제공하는 최적화된 훅
 * @returns {socket: Socket, subscribeMarket: (market: string) => void, unsubscribeMarket: (market: string) => void}
 */
export const useSocket = () => {
    const [isConnected, setIsConnected] = useState<boolean>(false);

    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        if (socketRef.current?.connected) return;

        const socket = io(process.env.NEXT_PUBLIC_WEBSOCKET_SERVER, {
            transports: ['websocket', 'polling'],
            forceNew: false,
            reconnection: true,
            reconnectionAttempts: 10, // 재연결 시도 횟수
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000, // 최대 재연결 지연 시간
            timeout: 20000, // 연결 타임아웃
        });

        socketRef.current = socket;

        const handleConnect = () => {
            console.log(CONSOLE_LOG.SOCKET_IO_CONNECTION_SUCCESS);
            console.log(CONSOLE_LOG.SOCKET_IO_CONNECTION_STATUS, socket.connected);
            setIsConnected(true);
        };

        const handleDisconnect = (reason: string) => {
            console.log(CONSOLE_LOG.SOCKET_IO_DISCONNECTION_SUCCESS);
            console.log(CONSOLE_LOG.SOCKET_IO_DISCONENCTION_REASON, reason);
            console.log(CONSOLE_LOG.SOCKET_IO_CONNECTION_STATUS, socket.connected);
            setIsConnected(false);
        };

        const handleConnectError = (error: Error) => {
            console.error(CONSOLE_ERROR.SOCKET_IO_CONNECTION_FAIL, error.message);
            console.warn(CONSOLE_WARN.NEED_TO_CHECK_SOCKET_SERVER);
            console.log(CONSOLE_LOG.SOCKET_IO_CONNECTION_STATUS, socket.connected);
            setIsConnected(false);
        };

        const handleReconnect = (attemptNumber: number) => {
            console.log(CONSOLE_LOG.SOCKET_IO_RECONNECTION_SUCCESS);
            console.log(CONSOLE_LOG.SOCKET_IO_RECONNECTION_SUCCESS_TRY_COUNTS, attemptNumber);
        };

        const handleReconnectAttempt = (attemptNumber: number) => {
            console.log(CONSOLE_LOG.SOCKET_IO_RECONNECTION_IN_PROGRESS);
            console.log(CONSOLE_LOG.SOCKET_IO_RECONNECTION_IN_PROGRESS_TRY_COUNTS, attemptNumber);
        };

        const handleReconnectError = (error: Error) => console.error(CONSOLE_ERROR.SOCKET_IO_RECONNECTION_FAIL, error.message);

        // 이벤트 리스너 등록
        socket.on('connect', handleConnect);
        socket.on('disconnect', handleDisconnect);
        socket.on('connect_error', handleConnectError);
        socket.on('reconnect', handleReconnect);
        socket.on('reconnect_attempt', handleReconnectAttempt);
        socket.on('reconnect_error', handleReconnectError);

        // 메모리 누수 방지
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
        if (socketRef.current?.connected) socketRef.current.emit('subscribe-market', market);
        else console.warn(CONSOLE_WARN.SUBSCRIPTION_FAIL, market);
    }, []);

    // 마켓 구독 해제 함수
    const unsubscribeMarket = useCallback((market: string) => {
        if (!market) return;
        if (socketRef.current?.connected) socketRef.current.emit('unsubscribe-market', market);
        else console.warn(CONSOLE_WARN.UNSUBSCRIPTION_FAIL, market);
    }, []);

    // 반환값 최적화를 위해 소켓 객체는 의존성에서 제외
    return useMemo(() => ({
        socket: socketRef.current,
        subscribeMarket,
        unsubscribeMarket,
        isConnected
    }), [subscribeMarket, unsubscribeMarket, isConnected]);
};