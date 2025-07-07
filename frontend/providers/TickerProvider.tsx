'use client';

import React, { createContext, useMemo, useState } from 'react';
import { ITicker } from '@/types/shared/ticker';

/** 실시간 현재가 정보 컨텍스트 */
interface ITickerContext {
    tickers: Record<string, ITicker>;
    setTickers: React.Dispatch<React.SetStateAction<Record<string, ITicker>>>;
    currentTicker: ITicker;
    selectedMarket: string;
    setSelectedMarket: (market: string) => void;
    krwNames: Record<string, string>;
    setKrwNames: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

export const TickerContext = createContext<ITickerContext>({
    tickers: {},
    setTickers: () => { },
    currentTicker: {} as ITicker,
    selectedMarket: '',
    setSelectedMarket: () => { },
    krwNames: {},
    setKrwNames: () => { },
});

/** 실시간 현재가 정보 프로바이더
 * 실시간 현재가 정보를 저장하고, 선택된 종목의 정보를 제공하는 컨텍스트를 제공합니다.
 * 종목 리스트 컴포넌트와 종목 상세 컴포넌트에서 사용됩니다.
 * @returns {tickers Record<string, ITicker>} 실시간 현재가 정보, 종목 코드를 키로 사용
 * @returns {selectedMarket string} 선택된 종목
 * @returns {krwNames Record<string, string>} 종목 한글명, 종목 코드를 키로 사용
 */
export function TickerProvider({ children }: { children: React.ReactNode }) {
    const [tickers, setTickers] = useState<Record<string, ITicker>>({});
    const [selectedMarket, setSelectedMarket] = useState<string>('KRW-BTC');
    const [krwNames, setKrwNames] = useState<Record<string, string>>({});

    const currentTicker = useMemo(() => tickers[selectedMarket], [tickers, selectedMarket]);

    return (
        <TickerContext value={{
            tickers,
            currentTicker,
            selectedMarket,
            krwNames,
            setTickers,
            setSelectedMarket,
            setKrwNames,
        }}>
            {children}
        </TickerContext>
    );
}