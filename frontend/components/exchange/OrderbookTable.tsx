'use client';

import { useConnectOrderbook } from "@/hooks/socket/useConnectOrderbook";
import { useContext, useEffect, useState, useMemo } from "react";
import { TickerContext } from "@/providers/TickerProvider";
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from '@/components/shadcn-ui/table';
import { Card } from '@/components/shadcn-ui/card';

export default function OrderbookTable() {
    const { selectedMarket, tickers } = useContext(TickerContext);

    const [askMaxSize, setAskMaxSize] = useState(0);
    const [bidMaxSize, setBidMaxSize] = useState(0);

    const { orderbook } = useConnectOrderbook(selectedMarket);

    // 현재가 변동률
    const rate = useMemo(() => {
        const ticker = tickers[selectedMarket] || {};
        return ticker.signed_change_rate ?? 0;
    }, [tickers, selectedMarket]);

    // 전일종가
    const prevPrice = useMemo(() => {
        const ticker = tickers[selectedMarket] || {};
        return ticker.prev_closing_price ?? 0;
    }, [tickers, selectedMarket]);

    // 색상
    const numColor = rate === 0 ? 'text-black' : rate > 0 ? 'text-positive' : 'text-negative';

    useEffect(() => {
        if (!orderbook || !orderbook.orderbook_units) {
            setAskMaxSize(0);
            setBidMaxSize(0);
            return;
        }

        const askSizes = orderbook.orderbook_units.map(unit => unit.ask_size);
        const bidSizes = orderbook.orderbook_units.map(unit => unit.bid_size);
        setAskMaxSize(Math.max(...askSizes, 0));
        setBidMaxSize(Math.max(...bidSizes, 0));
    }, [orderbook]);

    return (
        <Card className="w-full h-[26rem] py-0 overflow-y-scroll">
            <Table className="w-full border-collapse">
                <TableHeader className="h-[2.5rem] sticky top-0 z-10 bg-main">
                    <TableRow>
                        <TableHead className="w-1/3 py-[0.25rem] text-center text-white">매도 물량</TableHead>
                        <TableHead className="w-1/3 py-[0.25rem] text-center text-white">가격</TableHead>
                        <TableHead className="w-1/3 py-[0.25rem] text-center text-white">매수 물량</TableHead>
                    </TableRow>
                </TableHeader>

                {orderbook?.orderbook_units && orderbook.orderbook_units.length > 0 && (
                    <TableBody>
                        {/* 매도 Ask */}
                        {[...orderbook.orderbook_units].reverse().map((element, index) => (
                            <TableRow key={`ask_${element.ask_price}_${index}`}>
                                <TableCell className="w-1/3 py-1 bg-orderbook-bid h-[1rem]">
                                    {/* 볼륨 바 */}
                                    <div className="relative">
                                        <span className="absolute top-[0.2rem] right-0 text-2xs text-gray-500">
                                            {Number(element.ask_size).toFixed(4)}
                                        </span>
                                        <div
                                            className="absolute opacity-50 max-w-[100%] right-0 -top-[0.4rem] h-[0.6rem] bg-orderbook-bid-bar"
                                            style={{ width: askMaxSize ? `${(element.ask_size / askMaxSize) * 100}%` : '0%' }}
                                        />
                                    </div>
                                </TableCell>
                                <TableCell className="w-1/3 p-1">
                                    <div className="flex justify-between">
                                        <span className={`text-xs ${numColor}`}>
                                            {Number(element.ask_price).toLocaleString()}
                                        </span>
                                        <span className={`text-xs ${numColor}`}>
                                            {rate > 0 ? '+' : ''}
                                            {prevPrice ? (((element.ask_price - prevPrice) / prevPrice) * 100).toFixed(2) : '0.00'}
                                            {prevPrice && '%'}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="w-1/3 p-1" />
                            </TableRow>
                        ))}

                        {/* 매수 (bid) */}
                        {orderbook.orderbook_units.map((element, index) => (
                            <TableRow key={`bid_${element.bid_price}_${index}`}>
                                <TableCell className="w-1/3 p-1" />
                                <TableCell className="w-1/3 p-1">
                                    <div className="flex justify-between">
                                        <span className={`text-xs ${numColor}`}>
                                            {Number(element.bid_price).toLocaleString()}
                                        </span>
                                        <span className={`text-xs ${numColor}`}>
                                            {rate > 0 ? '+' : ''}
                                            {prevPrice ? (((element.bid_price - prevPrice) / prevPrice) * 100).toFixed(2) : '0.00'}
                                            {prevPrice && '%'}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className=" w-1/3 py-1 bg-orderbook-ask h-[1rem]">
                                    {/* 볼륨 바 */}
                                    <div className="relative">
                                        <span className="absolute top-[0.2rem] left-0 text-2xs text-gray-500">
                                            {Number(element.bid_size).toFixed(4)}
                                        </span>
                                        <div
                                            className="absolute opacity-50 max-w-[100%] left-0 -top-[0.5rem] h-[0.6rem] bg-orderbook-ask-bar"
                                            style={{ width: bidMaxSize ? `${(element.bid_size / bidMaxSize) * 100}%` : '0%' }}
                                        />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                )}
            </Table>
        </Card>
    );
}