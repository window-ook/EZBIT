'use client';

import { useEffect, useState } from 'react';
import { useSocket } from '@/hooks/socket/useSocket';
import dynamic from 'next/dynamic';

const ServerDownDialog = dynamic(() => import('@/components/exchange/ServerDownDialog'), { ssr: false });

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

/** 거래소 웹소켓 연결 상태 관리 컴포넌트
 * @description Production 환경에서 웹소켓 연결 실패 시 서버 중단 다이얼로그를 표시
 */
export default function ExchangeStatusManager() {
    const [showDialog, setShowDialog] = useState(false);
    const [hasShownDialog, setHasShownDialog] = useState(false);

    const { isConnected } = useSocket();

    useEffect(() => {
        if (!IS_PRODUCTION) return;

        if (!isConnected && !hasShownDialog) {
            const timer = setTimeout(() => {
                setShowDialog(true);
                setHasShownDialog(true);
            }, 3000);

            return () => clearTimeout(timer);
        }

        if (isConnected && showDialog) setShowDialog(false);
    }, [isConnected, hasShownDialog, showDialog]);

    if (!IS_PRODUCTION) return null;

    return (
        <ServerDownDialog
            isOpen={showDialog}
            onOpenChange={setShowDialog}
        />
    );
};