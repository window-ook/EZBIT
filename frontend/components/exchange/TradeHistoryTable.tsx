'use client';

import { useConnectTrade } from "@/hooks/socket/useConnectTrade";
import { useContext } from "react";
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

/**
 * 체결 시간을 포맷팅하는 헬퍼 함수
 * @param timestamp 체결 시간 (밀리초)
 * @returns 포맷팅된 시간 문자열
 */
const formatTime = (timestamp: number) => {
    const time = new Date(timestamp);
    const timeStr = time.toLocaleTimeString();
    return timeStr;
};

const TABLE_HEAD_STYLE = 'w-1/4 py-[0.25rem] text-center text-white';
const TABLE_CELL_STYLE = 'w-1/4 border-b border-slate-200 text-center';
const TABLE_CELL_VALUE_STYLE = 'text-xs lg:text-sm';

export default function TradeHistoryTable() {
    const { selectedMarket } = useContext(TickerContext);

    const { trades } = useConnectTrade(selectedMarket);

    return (
        <Card className="w-full h-full py-0 overflow-y-scroll">
            <Table>
                <TableHeader className="h-[2.5rem] sticky top-0 z-10 bg-main">
                    <TableRow>
                        <TableHead className={TABLE_HEAD_STYLE}>체결 시간</TableHead>
                        <TableHead className={TABLE_HEAD_STYLE}>체결 가격</TableHead>
                        <TableHead className={TABLE_HEAD_STYLE}>체결량</TableHead>
                        <TableHead className={TABLE_HEAD_STYLE}>체결금액</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {trades.slice().map(data => (
                        <TableRow
                            key={`${data.sequential_id}-${data.timestamp}-${Math.random()}`}
                        >
                            <TableCell className={TABLE_CELL_STYLE}>
                                <span className={TABLE_CELL_VALUE_STYLE}>
                                    {formatTime(data.timestamp)}
                                </span>
                            </TableCell>
                            <TableCell className={TABLE_CELL_STYLE}>
                                <span className={TABLE_CELL_VALUE_STYLE}>
                                    {Number(data.trade_price).toLocaleString()}원
                                </span>
                            </TableCell>
                            <TableCell className={TABLE_CELL_STYLE}>
                                <span
                                    className={`${TABLE_CELL_VALUE_STYLE} ${data.ask_bid === 'ASK' ? 'text-positive' : 'text-negative'}`}
                                >
                                    {data.trade_volume}
                                </span>
                            </TableCell>
                            <TableCell className={TABLE_CELL_STYLE}>
                                <span
                                    className={`${TABLE_CELL_VALUE_STYLE} ${data.ask_bid === 'ASK' ? 'text-positive' : 'text-negative'}`}
                                >
                                    {Math.round(
                                        data.trade_volume * data.trade_price,
                                    ).toLocaleString()}
                                    원
                                </span>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
    );
}