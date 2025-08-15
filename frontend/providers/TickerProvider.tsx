'use client';

import React, { createContext, useMemo, useState, useCallback } from 'react';
import { ITicker } from '@/types/upbit/ticker';

/** 실시간 현재가 정보 컨텍스트
 * @property tickers 모든 종목의 실시간 현재가 정보, 종목 코드를 키로 사용
 * @property setTickers 실시간 현재가 정보 설정
 * @property selectedMarket 선택된 종목
 * @property setSelectedMarket 종목 선택
 * @property currentTicker 선택된 종목의 실시간 현재가 정보
 * @property krwNames 모든 종목의 한글명 목록, 종목 코드를 키로 사용
 * @property setKrwNames 종목 한글명, 종목 코드 설정
 */
interface ITickerContext {
    tickers: Record<string, ITicker>;
    setTickers: React.Dispatch<React.SetStateAction<Record<string, ITicker>>>;
    selectedMarket: string;
    setSelectedMarket: (market: string) => void;
    currentTicker: ITicker;
    krwNames: Record<string, string>;
    setKrwNames: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

// 기본 빈 ticker 객체 (메모리 절약)
const EMPTY_TICKER: ITicker = {
    market: '',
    trade_price: 0,
    prev_closing_price: 0,
    signed_change_rate: 0,
    signed_change_price: 0,
    acc_trade_price_24h: 0,
    acc_trade_volume_24h: 0,
    high_price: 0,
    low_price: 0,
    lowest_52_week_price: 0,
    highest_52_week_price: 0,
};

// 기본 컨텍스트 값 (메모이제이션)
const DEFAULT_CONTEXT_VALUE: ITickerContext = {
    tickers: {},
    setTickers: () => { },
    selectedMarket: '',
    setSelectedMarket: () => { },
    currentTicker: EMPTY_TICKER,
    krwNames: {},
    setKrwNames: () => { },
};

export const TickerContext = createContext<ITickerContext>(DEFAULT_CONTEXT_VALUE);

/** 실시간 현재가 정보 프로바이더
 * @description 실시간 현재가 정보를 저장하고, 선택된 종목의 정보를 제공하는 최적화된 컨텍스트 프로바이더
 * @returns tickers 실시간 현재가 정보, 종목 코드를 키로 사용
 * @returns selectedMarket 선택된 종목
 * @returns krwNames 종목 한글명, 종목 코드를 키로 사용
 */
export function TickerProvider({ children }: { children: React.ReactNode }) {
    const [tickers, setTickers] = useState<Record<string, ITicker>>({});
    const [selectedMarket, setSelectedMarketState] = useState<string>('KRW-BTC');
    const [krwNames, setKrwNames] = useState<Record<string, string>>({});

    // 메모이제이션된 마켓 선택 함수
    const setSelectedMarket = useCallback((market: string) => {
        if (market && market !== selectedMarket) {
            setSelectedMarketState(market);
        }
    }, [selectedMarket]);

    // 현재 선택된 종목의 ticker 정보 (메모이제이션)
    const currentTicker = useMemo(() => {
        return tickers[selectedMarket] || EMPTY_TICKER;
    }, [tickers, selectedMarket]);

    // 최적화된 tickers 업데이트 함수
    const optimizedSetTickers = useCallback<React.Dispatch<React.SetStateAction<Record<string, ITicker>>>>((action) => {
        // 함수형 업데이트인 경우
        if (typeof action === 'function') {
            setTickers(prevTickers => {
                const newTickers = action(prevTickers);
                // 실제로 변경되었는지 확인
                if (newTickers === prevTickers) return prevTickers;
                return newTickers;
            });
        } else {
            // 직접 값인 경우
            setTickers(action);
        }
    }, []);

    // 최적화된 krwNames 업데이트 함수
    const optimizedSetKrwNames = useCallback<React.Dispatch<React.SetStateAction<Record<string, string>>>>((action) => {
        setKrwNames(prevNames => {
            // 함수형 업데이트인 경우
            if (typeof action === 'function') {
                const newNames = action(prevNames);
                // 실제로 변경되었는지 확인
                if (newNames === prevNames) return prevNames;
                return newNames;
            }
            // 직접 값인 경우
            return action;
        });
    }, []);

    // 컨텍스트 value 메모이제이션
    const contextValue = useMemo<ITickerContext>(() => ({
        tickers,
        currentTicker,
        selectedMarket,
        krwNames,
        setTickers: optimizedSetTickers,
        setSelectedMarket,
        setKrwNames: optimizedSetKrwNames,
    }), [
        tickers,
        currentTicker,
        selectedMarket,
        krwNames,
        optimizedSetTickers,
        setSelectedMarket,
        optimizedSetKrwNames
    ]);

    return (
        <TickerContext.Provider value={contextValue}>
            {children}
        </TickerContext.Provider>
    );
}