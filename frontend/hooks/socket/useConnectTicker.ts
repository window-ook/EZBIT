'use client';

import React, { useEffect } from 'react';
import { useSocket } from '@/hooks/socket/useSocket';
import { ITicker } from '@/types/shared/ticker';
import { IUpbitTicker } from '@/types/upbit/ticker';

interface IConnectTicker {
    markets: { market: string }[] | undefined;
    setTickers: React.Dispatch<React.SetStateAction<Record<string, ITicker>>>;
}

/**
 * @description 실시간 현재가 데이터 구독 훅
 * @param markets 종목 코드 목록
 * @param setTickers 현재가 데이터 업데이트 함수
 */
export function useConnectTicker({ markets, setTickers }: IConnectTicker) {
    const { socket, subscribeMarket, unsubscribeMarket } = useSocket();

    useEffect(() => {
        if (!markets) return;

        markets.forEach(m => subscribeMarket(m.market));

        const updateTickers = (tickerData: IUpbitTicker) => {
            setTickers(prev => ({
                ...prev, [tickerData.code]: {
                    market: tickerData.code,
                    trade_price: tickerData.trade_price,
                    prev_closing_price: tickerData.prev_closing_price,
                    signed_change_rate: tickerData.signed_change_rate,
                    signed_change_price: tickerData.signed_change_price,
                    acc_trade_price_24h: tickerData.acc_trade_price_24h,
                    acc_trade_volume_24h: tickerData.acc_trade_volume_24h,
                    high_price: tickerData.high_price,
                    low_price: tickerData.low_price,
                    lowest_52_week_price: tickerData.lowest_52_week_price,
                    highest_52_week_price: tickerData.highest_52_week_price,
                }
            }));
        };

        socket?.on('ticker-update', updateTickers);

        return () => {
            socket?.off('ticker-update', updateTickers);
            markets.forEach(m => unsubscribeMarket(m.market));
        };
    }, [markets, socket, subscribeMarket, unsubscribeMarket, setTickers]);
}