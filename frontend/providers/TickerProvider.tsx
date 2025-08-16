'use client';

import React, { createContext, useMemo, useState, useCallback } from 'react';
import { ITicker } from '@/types/upbit/ticker';
import { IUpbitOrderbook } from '@/types/upbit/orderbook';
import { IUpbitTrade } from '@/types/upbit/trade';

type TickerState = Record<string, ITicker>;
type KrwNamesState = Record<string, string>;
type SetTickerState = (tickersOrUpdater: TickerState | ((prev: TickerState) => TickerState)) => void;
type SetKrwNamesState = (namesOrUpdater: KrwNamesState | ((prev: KrwNamesState) => KrwNamesState)) => void;

/** 실시간 현재가 정보 컨텍스트
 * @property tickers 모든 종목의 실시간 현재가 정보, 종목 코드를 키로 사용
 * @property setTickers 실시간 현재가 정보 설정
 * @property selectedMarket 선택된 종목
 * @property setSelectedMarket 종목 선택
 * @property currentTicker 선택된 종목의 실시간 현재가 정보
 * @property krwNames 모든 종목의 한글명 목록, 종목 코드를 키로 사용
 * @property setKrwNames 종목 한글명, 종목 코드 설정
 * @property initialOrderbook 선택된 마켓의 초기 오더북 데이터
 * @property initialTradeHistory 선택된 마켓의 초기 체결내역 데이터
 * @property isLoadingInitialData 초기 데이터 로딩 상태
 */
interface ITickerContext {
    tickers: TickerState;
    setTickers: SetTickerState;
    selectedMarket: string;
    setSelectedMarket: (market: string) => void;
    currentTicker: ITicker;
    krwNames: KrwNamesState;
    setKrwNames: SetKrwNamesState;
    initialOrderbook: IUpbitOrderbook | null;
    initialTradeHistory: IUpbitTrade[];
    isLoadingInitialData: boolean;
}

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

const DEFAULT_CONTEXT_VALUE: ITickerContext = {
    tickers: {},
    setTickers: () => { },
    selectedMarket: '',
    setSelectedMarket: () => { },
    currentTicker: EMPTY_TICKER,
    krwNames: {},
    setKrwNames: () => { },
    initialOrderbook: null,
    initialTradeHistory: [],
    isLoadingInitialData: false,
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
    const [initialOrderbook, setInitialOrderbook] = useState<IUpbitOrderbook | null>(null);
    const [initialTradeHistory, setInitialTradeHistory] = useState<IUpbitTrade[]>([]);
    const [isLoadingInitialData, setIsLoadingInitialData] = useState<boolean>(false);

    /**
     * 라우트 핸들러를 통해 초기 오더북 데이터를 가져옵니다.
     * @param market - 조회할 마켓 코드
     * @returns Promise<IUpbitOrderbook | null>
     */
    const fetchInitialOrderbook = async (market: string): Promise<IUpbitOrderbook | null> => {
        const response = await fetch(`/api/orderbook?market=${market}`);
        if (!response.ok) {
            throw new Error('오더북 데이터를 가져오는데 실패했습니다.');
        }
        const result = await response.json();
        return result.data;
    };

    /**
     * 라우트 핸들러를 통해 초기 체결내역 데이터를 가져옵니다.
     * @param market - 조회할 마켓 코드
     * @param count - 조회할 개수 (기본값: 50)
     * @returns Promise<IUpbitTrade[]>
     */
    const fetchInitialTradeHistory = async (market: string, count: number = 50): Promise<IUpbitTrade[]> => {
        const response = await fetch(`/api/trade-history?market=${market}&count=${count}`);
        if (!response.ok) {
            throw new Error('체결내역 데이터를 가져오는데 실패했습니다.');
        }
        const result = await response.json();
        return result.data;
    };

    const setSelectedMarket = useCallback(async (market: string) => {
        if (market && market !== selectedMarket) {
            setSelectedMarketState(market);

            // 초기 데이터 로딩 시작
            setIsLoadingInitialData(true);

            try {
                // 병렬로 초기 데이터 가져오기
                const [orderbook, tradeHistory] = await Promise.all([
                    fetchInitialOrderbook(market),
                    fetchInitialTradeHistory(market)
                ]);

                setInitialOrderbook(orderbook);
                setInitialTradeHistory(tradeHistory);
            } catch (error) {
                console.error('초기 데이터 로딩 실패:', error);
                setInitialOrderbook(null);
                setInitialTradeHistory([]);
            } finally {
                setIsLoadingInitialData(false);
            }
        }
    }, [selectedMarket]);

    const currentTicker = useMemo(() => {
        return tickers[selectedMarket] || EMPTY_TICKER;
    }, [tickers, selectedMarket]);

    const optimizedSetTickers = useCallback<SetTickerState>((tickersOrUpdater) => {
        if (typeof tickersOrUpdater === 'function') {
            setTickers(prevTickers => {
                const newTickers = tickersOrUpdater(prevTickers);
                if (newTickers === prevTickers) return prevTickers;
                return newTickers;
            });
        } else setTickers(tickersOrUpdater);
    }, []);

    const optimizedSetKrwNames = useCallback<SetKrwNamesState>((namesOrUpdater) => {
        setKrwNames(prevNames => {
            if (typeof namesOrUpdater === 'function') {
                const newNames = namesOrUpdater(prevNames);
                if (newNames === prevNames) return prevNames;
                return newNames;
            }
            return namesOrUpdater;
        });
    }, []);

    const contextValue = useMemo<ITickerContext>(() => ({
        tickers,
        currentTicker,
        selectedMarket,
        krwNames,
        setTickers: optimizedSetTickers,
        setSelectedMarket,
        setKrwNames: optimizedSetKrwNames,
        initialOrderbook,
        initialTradeHistory,
        isLoadingInitialData,
    }), [
        tickers,
        currentTicker,
        selectedMarket,
        krwNames,
        optimizedSetTickers,
        setSelectedMarket,
        optimizedSetKrwNames,
        initialOrderbook,
        initialTradeHistory,
        isLoadingInitialData
    ]);

    return (
        <TickerContext.Provider value={contextValue}>
            {children}
        </TickerContext.Provider>
    );
}