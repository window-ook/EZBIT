'use client';

import { Card, CardContent } from "@/components/shadcn-ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shadcn-ui/table";
import { TickerContext } from '@/providers/TickerProvider';
import { ISupabaseHoldings } from "@/types/supabase/holdings";
import { TABLE_CELL_STYLE } from '@/utils/shared/styles';
import { useContext } from 'react';

export function HoldingsTable({ holdings }: { holdings: ISupabaseHoldings[] }) {
    const { tickers } = useContext(TickerContext);

    const holdingsWithTickers = holdings.map(holding => ({
        ...holding,
        trade_price: tickers?.[holding.market]?.trade_price ?? 0,
    }));

    return (
        <Card className="w-full h-full overflow-y-auto">
            <CardContent>
                <Table className="w-full table-fixed">
                    <TableHeader>
                        <TableRow>
                            <TableHead className={TABLE_CELL_STYLE}>종목</TableHead>
                            <TableHead className={TABLE_CELL_STYLE}>보유수량</TableHead>
                            <TableHead className={TABLE_CELL_STYLE}>평균단가</TableHead>
                            <TableHead className={TABLE_CELL_STYLE}>현재가</TableHead>
                            <TableHead className={TABLE_CELL_STYLE}>평가금액</TableHead>
                            <TableHead className={TABLE_CELL_STYLE}>평가손익</TableHead>
                            <TableHead className={TABLE_CELL_STYLE}>수익률</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {holdingsWithTickers.map((holding, index) => (
                            <TableRow key={index} className="text-xs">
                                <TableCell className={TABLE_CELL_STYLE}>{holding.market}</TableCell>
                                <TableCell className={TABLE_CELL_STYLE}>{holding.total_bid_volume}</TableCell>
                                <TableCell className={TABLE_CELL_STYLE}>{holding.avg_bid_price.toLocaleString()}</TableCell>
                                <TableCell className={TABLE_CELL_STYLE}>{holding.trade_price.toLocaleString()}</TableCell>
                                <TableCell className={TABLE_CELL_STYLE}>{(holding.trade_price * holding.total_bid_volume).toLocaleString()}</TableCell>
                                <TableCell className={`${TABLE_CELL_STYLE} ${holding.trade_price * holding.total_bid_volume - holding.total_bid_amount > 0 ? 'text-positive' : holding.trade_price * holding.total_bid_volume - holding.total_bid_amount < 0 ? 'text-negative' : ''}`}>{(holding.trade_price * holding.total_bid_volume - holding.total_bid_amount).toLocaleString()}</TableCell>
                                <TableCell className={`${TABLE_CELL_STYLE} ${holding.trade_price * holding.total_bid_volume - holding.total_bid_amount > 0 ? 'text-positive' : holding.trade_price * holding.total_bid_volume - holding.total_bid_amount < 0 ? 'text-negative' : ''}`}>{(((holding.trade_price * holding.total_bid_volume - holding.total_bid_amount) / holding.total_bid_amount) * 100).toFixed(4)}%</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}