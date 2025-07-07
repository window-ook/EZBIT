'use client';

import React, { createContext, useState } from 'react';

/**
 * 종목 리스트, 종목 상세 정보 컴포넌트에 필요한 현재가 정보
 * @typedef {Object} ITicker
 * @property {string} market - 종목 코드
 * @property {number} trade_price - 현재가
 * @property {number} prev_closing_price - 전일 종가
 * @property {number} signed_change_rate - 전일 대비 변동률
 * @property {number} signed_change_price - 전일 대비 변동금액
 * @property {number} acc_trade_price_24h - 24시간 누적 거래대금
 * @property {number} acc_trade_volume_24h - 24시간 누적 거래량
 * @property {number} high_price - 고가
 * @property {number} low_price - 저가
 * @property {number} lowest_52_week_price - 52주 신저가
 * @property {number} highest_52_week_price - 52주 신고가
 */
interface ITicker {
    market: string;
    trade_price: number;
    prev_closing_price: number;
    signed_change_rate: number;
    signed_change_price: number;
    acc_trade_price_24h: number;
    acc_trade_volume_24h: number;
    high_price: number;
    low_price: number;
    lowest_52_week_price: number;
    highest_52_week_price: number;
}

/** 실시간 현재가 정보 컨텍스트 */
interface ITickerContext {
    tickers: Record<string, ITicker>;
    setTickers: React.Dispatch<React.SetStateAction<Record<string, ITicker>>>;
    selectedMarket: string;
    setSelectedMarket: (market: string) => void;
    krwNames: Record<string, string>;
    setKrwNames: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

export const TickerContext = createContext<ITickerContext>({
    tickers: {},
    setTickers: () => { },
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

    return (
        <TickerContext value={{
            tickers,
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