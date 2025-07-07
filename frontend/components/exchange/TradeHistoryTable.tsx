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

export default function TradeHistoryTable() {
    const { selectedMarket } = useContext(TickerContext);

    const { trades } = useConnectTrade(selectedMarket);

    return (
        <Card className="w-full h-full py-0 overflow-y-scroll">
            <Table>
                <TableHeader className="h-[2.5rem] sticky top-0 z-10 bg-main">
                    <TableRow>
                        <TableHead className="w-1/4 py-[0.25rem] text-center text-white">체결 시간</TableHead>
                        <TableHead className="w-1/4 py-[0.25rem] text-center text-white">체결 가격</TableHead>
                        <TableHead className="w-1/4 py-[0.25rem] text-center text-white">체결량</TableHead>
                        <TableHead className="w-1/4 py-[0.25rem] text-center text-white">체결금액</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {trades.slice().map(data => (
                        <TableRow
                            key={`${data.sequential_id}-${data.timestamp}-${Math.random()}`}
                        >
                            <TableCell className="w-1/4 border-b border-b-[#e0e0e0] text-center">
                                <span className="text-xs lg:text-sm">
                                    {formatTime(data.timestamp)}
                                </span>
                            </TableCell>
                            <TableCell className="w-1/4 border-b border-b-[#e0e0e0] text-center">
                                <span className="text-xs lg:text-sm">
                                    {Number(data.trade_price).toLocaleString()}원
                                </span>
                            </TableCell>
                            <TableCell className="w-1/4 border-b border-b-[#e0e0e0] text-center">
                                <span
                                    className={`text-xs lg:text-sm ${data.ask_bid === 'ASK' ? 'text-positive' : 'text-negative'
                                        }`}
                                >
                                    {data.trade_volume}
                                </span>
                            </TableCell>
                            <TableCell className="w-1/4 border-b border-b-[#e0e0e0] text-center">
                                <span
                                    className={`text-xs lg:text-sm ${data.ask_bid === 'ASK' ? 'text-positive' : 'text-negative'
                                        }`}
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