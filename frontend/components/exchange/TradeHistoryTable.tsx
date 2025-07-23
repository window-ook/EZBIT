'use client';

import React, { useContext, useMemo, memo } from "react";
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
import type { IUpbitTrade } from '@/types/upbit/trade';

const TABLE_STYLES = {
    head: 'w-1/4 py-[0.25rem] text-center text-white',
    cell: 'w-1/4 border-b border-slate-200 text-center',
    value: 'text-xs lg:text-sm'
} as const;

const TRADE_COLORS = {
    ask: 'text-positive', // 매도 (빨간색)
    bid: 'text-negative'  // 매수 (파란색)
} as const;

/**
 * 체결 시간을 포맷팅하는 헬퍼 함수
 * @param timestamp 체결 시간 (밀리초)
 * @returns 포맷팅된 시간 문자열
 */
const formatTime = (() => {
    const cache = new Map<number, string>();

    return (timestamp: number): string => {
        if (cache.has(timestamp)) {
            return cache.get(timestamp)!;
        }

        const time = new Date(timestamp);
        const timeStr = time.toLocaleTimeString();

        // 캐시 크기 제한
        if (cache.size > 1000) {
            const firstKey = cache.keys().next().value;
            if (firstKey !== undefined) {
                cache.delete(firstKey);
            }
        }

        cache.set(timestamp, timeStr);
        return timeStr;
    };
})();

interface ITradeRow {
    trade: IUpbitTrade;
}

const TradeRow = memo<ITradeRow>(({ trade }) => {
    // 색상 결정
    const tradeColor = useMemo(() => {
        return trade.ask_bid === 'ASK' ? TRADE_COLORS.ask : TRADE_COLORS.bid;
    }, [trade.ask_bid]);

    // 포맷된 값들
    const formattedValues = useMemo(() => ({
        time: formatTime(trade.timestamp),
        price: trade.trade_price.toLocaleString(),
        volume: trade.trade_volume,
        amount: Math.round(trade.trade_volume * trade.trade_price).toLocaleString()
    }), [trade.timestamp, trade.trade_price, trade.trade_volume]);

    // 고유 key
    const key = `${trade.sequential_id}-${trade.timestamp}`;

    return (
        <TableRow key={key}>
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
    const { selectedMarket } = useContext(TickerContext);
    const { trades } = useTradeSocket(selectedMarket);

    // 거래내역 렌더링 최적화
    const renderTrades = useMemo(() => {
        return trades.map(trade => (
            <TradeRow
                key={`${trade.sequential_id}-${trade.timestamp}`}
                trade={trade}
            />
        ));
    }, [trades]);

    return (
        <Card
            aria-label='거래내역 테이블'
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