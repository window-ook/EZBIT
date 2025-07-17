'use client';

import React, { createContext, useMemo, useState } from 'react';
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

export const TickerContext = createContext<ITickerContext>({
    tickers: {},
    setTickers: () => { },
    selectedMarket: '',
    setSelectedMarket: () => { },
    currentTicker: {} as ITicker,
    krwNames: {},
    setKrwNames: () => { },
});

/** 실시간 현재가 정보 프로바이더
 * @description 실시간 현재가 정보를 저장하고, 선택된 종목의 정보를 제공하는 컨텍스트를 제공합니다.
 * @returns tickers 실시간 현재가 정보, 종목 코드를 키로 사용
 * @returns selectedMarket 선택된 종목
 * @returns krwNames 종목 한글명, 종목 코드를 키로 사용
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