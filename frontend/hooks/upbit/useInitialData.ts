'use client';

import { useContext, useMemo } from 'react';
import { TickerContext } from '@/providers/TickerProvider';

/**
 * Suspense와 호환되는 초기 데이터 로딩 훅
 * @description 선택된 마켓의 초기 데이터가 로딩 중일 때 Promise를 throw하여 Suspense 트리거
 * @returns {initialOrderbook, initialTradeHistory} - 초기 오더북과 체결내역 데이터
 */
export function useInitialData() {
    const { initialOrderbook, initialTradeHistory, isLoadingInitialData } = useContext(TickerContext);
    
    // Suspense를 위한 Promise throw
    const data = useMemo(() => {
        if (isLoadingInitialData) {
            // Promise를 throw하여 Suspense가 fallback을 표시하도록 함
            throw new Promise((resolve) => {
                // 로딩이 완료될 때까지 대기
                const checkLoading = () => {
                    if (!isLoadingInitialData) {
                        resolve({ initialOrderbook, initialTradeHistory });
                    } else {
                        setTimeout(checkLoading, 100);
                    }
                };
                checkLoading();
            });
        }
        
        return { initialOrderbook, initialTradeHistory };
    }, [initialOrderbook, initialTradeHistory, isLoadingInitialData]);
    
    return data;
}