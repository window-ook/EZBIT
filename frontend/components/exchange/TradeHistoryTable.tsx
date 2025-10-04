'use client';

import React, { useContext, useMemo, memo, useRef, useCallback, useEffect } from "react";
import { useTradeSocket } from "@/hooks/socket/useTradeSocket";
import { TickerContext } from "@/providers/TickerProvider";
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from '@/components/shadcn-ui/table';
import { Card } from "@/components/shadcn-ui/card";
import { IUpbitTrade } from '@/types/upbit/trade';

const TABLE_STYLES = {
    head: 'w-1/4 py-[0.25rem] font-chart-header text-center text-white',
    cell: 'w-1/4 border-b border-slate-200 text-center',
    value: 'text-xs lg:text-sm'
} as const;

const TRADE_COLORS = {
    ask: 'text-positive',
    bid: 'text-negative'
} as const;

interface ITradeRow {
    trade: IUpbitTrade;
    formatTime: (timestamp: number) => string;
}

/** 체결 내역 테이블 행 */
const TradeRow = memo<ITradeRow>(({ trade, formatTime }) => {
    const tradeColor = useMemo(() => {
        return trade.ask_bid === 'ASK' ? TRADE_COLORS.ask : TRADE_COLORS.bid;
    }, [trade.ask_bid]);

    const formattedValues = useMemo(() => ({
        time: formatTime(trade.timestamp),
        price: trade.trade_price.toLocaleString(),
        volume: trade.trade_volume,
        amount: Math.round(trade.trade_volume * trade.trade_price).toLocaleString()
    }), [trade.timestamp, trade.trade_price, trade.trade_volume, formatTime]);

    return (
        <TableRow>
            <TableCell className={TABLE_STYLES.cell}>
                <dt className={TABLE_STYLES.value}>
                    {formattedValues.time}
                </dt>
            </TableCell>
            <TableCell className={TABLE_STYLES.cell}>
                <dt className={TABLE_STYLES.value}>
                    {formattedValues.price}원
                </dt>
            </TableCell>
            <TableCell className={TABLE_STYLES.cell}>
                <dt className={`${TABLE_STYLES.value} ${tradeColor}`}>
                    {formattedValues.volume}
                </dt>
            </TableCell>
            <TableCell className={TABLE_STYLES.cell}>
                <dt className={`${TABLE_STYLES.value} ${tradeColor}`}>
                    {formattedValues.amount}원
                </dt>
            </TableCell>
        </TableRow>
    );
});

TradeRow.displayName = 'TradeRow';

function TradeHistoryTable() {
    const { selectedMarket, initialTradeHistory } = useContext(TickerContext);

    const { trades } = useTradeSocket(selectedMarket);

    const formatTimeCacheRef = useRef(new Map<number, string>());
    const maxCacheSize = 500;

    const formatTime = useCallback((timestamp: number): string => {
        const cache = formatTimeCacheRef.current;

        if (cache.has(timestamp)) return cache.get(timestamp)!;

        const time = new Date(timestamp);
        const timeStr = time.toLocaleTimeString('ko-KR', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });

        if (cache.size >= maxCacheSize) {
            const firstKey = cache.keys().next().value;
            if (firstKey !== undefined) cache.delete(firstKey);
        }

        cache.set(timestamp, timeStr);
        return timeStr;
    }, []);

    useEffect(() => {
        const cache = formatTimeCacheRef.current;

        return () => {
            cache.clear();
        };
    }, []);

    // 거래 내역 데이터 처리: 실시간 데이터 우선, 초기 데이터 폴백
    const currentTrades = useMemo(() => {
        if (trades.length > 0) return trades;
        return initialTradeHistory;
    }, [trades, initialTradeHistory]);

    // 거래 내역 렌더링 최적화
    const renderTrades = useMemo(() => {
        if (currentTrades.length === 0) {
            return (
                <TableRow>
                    <TableCell colSpan={4} className="py-4 text-center text-description">
                        거래 내역이 없습니다
                    </TableCell>
                </TableRow>
            );
        }

        return currentTrades.map((trade, index) => (
            <TradeRow
                key={`${selectedMarket}-${trade.sequential_id}-${trade.timestamp}-${index}`}
                trade={trade}
                formatTime={formatTime}
            />
        ));
    }, [currentTrades, selectedMarket, formatTime]);

    return (
        <Card
            aria-label='거래 내역 테이블'
            className="w-full h-[15rem] md:h-full py-0 overflow-y-scroll">
            <Table className="rounded-b-full">
                <TableHeader className="h-[2.5rem] sticky top-0 z-10 bg-main">
                    <TableRow>
                        <TableHead className={TABLE_STYLES.head}>체결 시간</TableHead>
                        <TableHead className={TABLE_STYLES.head}>체결 가격</TableHead>
                        <TableHead className={TABLE_STYLES.head}>체결량</TableHead>
                        <TableHead className={TABLE_STYLES.head}>체결금액</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {renderTrades}
                </TableBody>
            </Table>
        </Card >
    );
}

export default memo(TradeHistoryTable);