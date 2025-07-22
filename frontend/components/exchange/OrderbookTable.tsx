'use client';

import React, { useContext, useMemo, memo } from "react";
import { useOrderbookSocket } from "@/hooks/socket/useOrderbookSocket";
import { TickerContext } from "@/providers/TickerProvider";
import type { IUpbitOrderbook } from '@/types/upbit/orderbook';
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from '@/components/shadcn-ui/table';
import { Card } from '@/components/shadcn-ui/card';

const TABLE_STYLES = {
    head: 'w-1/3 py-[0.25rem] text-center text-white',
    cellWithBar: 'w-1/3 h-[1rem] py-1',
    cellWithoutBar: 'w-1/3 p-1',
    volumeLabel: 'absolute top-[0.2rem] text-2xs text-gray-500',
    volumeBar: 'absolute max-w-[100%] -top-[0.4rem] h-[0.6rem] opacity-50'
} as const;

const PRICE_COLORS = {
    positive: 'text-positive',
    negative: 'text-negative',
    neutral: 'text-black'
} as const;

interface IOrderbookRow {
    unit: IUpbitOrderbook['orderbook_units'][0];
    type: 'ask' | 'bid';
    maxSize: number;
    numColor: string;
    prevPrice: number;
    rate: number;
    index: number;
}

const OrderbookRow = memo<IOrderbookRow>(({ unit, type, maxSize, numColor, prevPrice, rate, index }) => {
    const isAsk = type === 'ask';
    const price = isAsk ? unit.ask_price : unit.bid_price;
    const size = isAsk ? unit.ask_size : unit.bid_size;

    // 퍼센트
    const percentage = useMemo(() => {
        if (!prevPrice) return '0.00';
        return (((price - prevPrice) / prevPrice) * 100).toFixed(2);
    }, [price, prevPrice]);

    // 볼륨 바
    const volumeWidth = useMemo(() => {
        return maxSize ? `${(size / maxSize) * 100}%` : '0%';
    }, [size, maxSize]);

    // 포맷된 값들
    const formattedValues = useMemo(() => ({
        price: price.toLocaleString(),
        size: size.toFixed(4),
        percentage: rate > 0 ? `+${percentage}` : percentage
    }), [price, size, percentage, rate]);

    if (isAsk) {
        return (
            <TableRow key={`ask_${price}_${index}`}>
                <TableCell className={`${TABLE_STYLES.cellWithBar} bg-orderbook-bid`}>
                    <dl className="relative">
                        <dt className={`${TABLE_STYLES.volumeLabel} right-0`}>
                            {formattedValues.size}
                        </dt>
                        <div
                            className={`${TABLE_STYLES.volumeBar} right-0 bg-orderbook-bid-bar`}
                            style={{ width: volumeWidth }}
                        />
                    </dl>
                </TableCell>
                <TableCell className={TABLE_STYLES.cellWithoutBar}>
                    <dl className="flex justify-between">
                        <dt className={`text-xs ${numColor}`}>
                            {formattedValues.price}
                        </dt>
                        <dd className={`text-xs ${numColor}`}>
                            {formattedValues.percentage}
                            {prevPrice && '%'}
                        </dd>
                    </dl>
                </TableCell>
                <TableCell className={TABLE_STYLES.cellWithoutBar} />
            </TableRow>
        );
    }

    return (
        <TableRow key={`bid_${price}_${index}`}>
            <TableCell className={TABLE_STYLES.cellWithoutBar} />
            <TableCell className={TABLE_STYLES.cellWithoutBar}>
                <dl className="flex justify-between">
                    <dt className={`text-xs ${numColor}`}>
                        {formattedValues.price}
                    </dt>
                    <dd className={`text-xs ${numColor}`}>
                        {formattedValues.percentage}
                        {prevPrice && '%'}
                    </dd>
                </dl>
            </TableCell>
            <TableCell className={`${TABLE_STYLES.cellWithBar} bg-orderbook-ask`}>
                <dl className="relative">
                    <dt className={`${TABLE_STYLES.volumeLabel} left-0`}>
                        {formattedValues.size}
                    </dt>
                    <div
                        className={`${TABLE_STYLES.volumeBar} left-0 bg-orderbook-ask-bar`}
                        style={{ width: volumeWidth }}
                    />
                </dl>
            </TableCell>
        </TableRow>
    );
});

OrderbookRow.displayName = 'OrderbookRow';

function OrderbookTable() {
    const { selectedMarket, tickers } = useContext(TickerContext);
    const { orderbook } = useOrderbookSocket(selectedMarket);

    // 현재 ticker 정보
    const currentTicker = useMemo(() => {
        return tickers[selectedMarket] || {};
    }, [tickers, selectedMarket]);

    // 현재가 변동률과 전일종가
    const { rate, prevPrice, numColor } = useMemo(() => {
        const tickerRate = currentTicker.signed_change_rate ?? 0;
        const tickerPrevPrice = currentTicker.prev_closing_price ?? 0;
        const color = tickerRate === 0 ? PRICE_COLORS.neutral
            : tickerRate > 0 ? PRICE_COLORS.positive
                : PRICE_COLORS.negative;

        return {
            rate: tickerRate,
            prevPrice: tickerPrevPrice,
            numColor: color
        };
    }, [currentTicker]);

    // 오더북 데이터 처리
    const orderbookData = useMemo(() => {
        if (!orderbook?.orderbook_units || orderbook.orderbook_units.length === 0) {
            return {
                askUnits: [],
                bidUnits: [],
                askMaxSize: 0,
                bidMaxSize: 0
            };
        }

        const units = orderbook.orderbook_units;

        // 매도 호가는 높은 가격부터 정렬
        const askUnits = [...units].reverse();
        const bidUnits = units;

        // 최대 사이즈 계산
        const askSizes = units.map(unit => unit.ask_size);
        const bidSizes = units.map(unit => unit.bid_size);
        const askMaxSize = Math.max(...askSizes, 0);
        const bidMaxSize = Math.max(...bidSizes, 0);

        return {
            askUnits,
            bidUnits,
            askMaxSize,
            bidMaxSize
        };
    }, [orderbook]);

    return (
        <Card
            aria-label='오더북 테이블'
            className="w-full h-[26rem] py-0 overflow-y-scroll">
            <Table className="w-full border-collapse">
                <TableHeader className="h-[2.5rem] sticky top-0 z-10 bg-main">
                    <TableRow>
                        <TableHead className={TABLE_STYLES.head}>매도 물량</TableHead>
                        <TableHead className={TABLE_STYLES.head}>가격</TableHead>
                        <TableHead className={TABLE_STYLES.head}>매수 물량</TableHead>
                    </TableRow>
                </TableHeader>

                {orderbookData.askUnits.length > 0 && (
                    <TableBody>
                        {/* 매도 Ask */}
                        {orderbookData.askUnits.map((unit, index) => (
                            <OrderbookRow
                                key={`ask_${unit.ask_price}_${index}`}
                                unit={unit}
                                type="ask"
                                maxSize={orderbookData.askMaxSize}
                                numColor={numColor}
                                prevPrice={prevPrice}
                                rate={rate}
                                index={index}
                            />
                        ))}

                        {/* 매수 Bid */}
                        {orderbookData.bidUnits.map((unit, index) => (
                            <OrderbookRow
                                key={`bid_${unit.bid_price}_${index}`}
                                unit={unit}
                                type="bid"
                                maxSize={orderbookData.bidMaxSize}
                                numColor={numColor}
                                prevPrice={prevPrice}
                                rate={rate}
                                index={index}
                            />
                        ))}
                    </TableBody>
                )}
            </Table>
        </Card>
    );
}

export default memo(OrderbookTable);