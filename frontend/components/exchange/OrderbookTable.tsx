'use client';

import React, { useContext, useMemo, memo } from "react";
import { useOrderbookSocket } from "@/hooks/socket/useOrderbookSocket";
import { TickerContext } from "@/providers/TickerProvider";
import { IUpbitOrderbook } from '@/types/upbit/orderbook';
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
    head: 'w-1/3 py-[0.25rem] font-chart-header text-center text-white',
    cellWithBar: 'w-1/3 h-[1rem] py-1',
    cellWithoutBar: 'w-1/3 p-1',
    volumeLabel: 'absolute top-[0.2rem] text-3xs text-gray-500',
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

const OrderbookRow = memo<IOrderbookRow>(({ unit, type, maxSize, numColor, prevPrice, rate }) => {
    const isAsk = type === 'ask';
    const price = isAsk ? unit.ask_price : unit.bid_price;
    const size = isAsk ? unit.ask_size : unit.bid_size;

    const percentage = useMemo(() => {
        if (!prevPrice) return '0.00';
        return (((price - prevPrice) / prevPrice) * 100).toFixed(2);
    }, [price, prevPrice]);

    const volumeWidth = useMemo(() => {
        return maxSize ? `${(size / maxSize) * 100}%` : '0%';
    }, [size, maxSize]);

    const formattedValues = useMemo(() => ({
        price: price.toLocaleString(),
        size: size.toFixed(4),
        percentage: rate > 0 ? `+${percentage}` : percentage
    }), [price, size, percentage, rate]);

    if (isAsk) {
        return (
            <TableRow>
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
        <TableRow>
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

/** 거래소 오더북 테이블
 * @description 실시간 데이터 우선, 초기 데이터 폴백
 * */
function OrderbookTable() {
    const { selectedMarket, currentTicker, initialOrderbook, isLoadingInitialData } = useContext(TickerContext);

    const { orderbook } = useOrderbookSocket(selectedMarket);

    // Suspense 동작을 위한 최적화된 대기 로직
    if (isLoadingInitialData && !orderbook && !initialOrderbook) {
        throw new Promise((resolve) => {
            const timeout = setTimeout(() => { resolve(null); }, 1000);

            const checkData = () => {
                if (!isLoadingInitialData || orderbook || initialOrderbook) {
                    clearTimeout(timeout);
                    resolve(null);
                    return;
                }
                requestAnimationFrame(checkData);
            };

            checkData();
        });
    }

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

    const orderbookData = useMemo(() => {
        const currentOrderbook = orderbook || initialOrderbook;

        if (!currentOrderbook?.orderbook_units || currentOrderbook.orderbook_units.length === 0) {
            return {
                askUnits: [],
                bidUnits: [],
                askMaxSize: 0,
                bidMaxSize: 0
            };
        }

        const units = currentOrderbook.orderbook_units;

        // 매도 호가: 높은 가격부터
        const askUnits = [...units].reverse();
        const bidUnits = units;

        // 매도 호가, 매수 호가 최대 사이즈
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
    }, [orderbook, initialOrderbook]);

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

                {orderbookData.askUnits.length > 0 ? (
                    <TableBody>
                        {/* 매도 */}
                        {orderbookData.askUnits.map((unit, index) => (
                            <OrderbookRow
                                key={`${selectedMarket}-ask-${unit.ask_price}-${index}`}
                                unit={unit}
                                type="ask"
                                maxSize={orderbookData.askMaxSize}
                                numColor={numColor}
                                prevPrice={prevPrice}
                                rate={rate}
                                index={index}
                            />
                        ))}

                        {/* 매수 */}
                        {orderbookData.bidUnits.map((unit, index) => (
                            <OrderbookRow
                                key={`${selectedMarket}-bid-${unit.bid_price}-${index}`}
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
                ) : (
                    <TableBody>
                        <TableRow>
                            <TableCell colSpan={3} className="text-center py-4 text-description">
                                오더북 데이터가 없습니다
                            </TableCell>
                        </TableRow>
                    </TableBody>
                )}
            </Table>
        </Card>
    );
}

export default memo(OrderbookTable);