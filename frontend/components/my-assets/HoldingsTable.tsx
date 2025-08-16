'use client';

import { useContext } from 'react';
import { TickerContext } from '@/providers/TickerProvider';
import { useHoldings } from '@/hooks/supabase/holdings/useHoldings';
import { TABLE_CELL_STYLE } from '@/utils/shared/styles';
import { Card, CardContent } from "@/components/shadcn-ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shadcn-ui/table";

export default function HoldingsTable() {
    const { tickers } = useContext(TickerContext);

    const { holdings } = useHoldings();

    const holdingsWithTickers = holdings.map(holding => ({
        ...holding,
        trade_price: tickers?.[holding.market]?.trade_price ?? 0,
    }));

    return (
        <Card
            aria-label='보유 자산 상세 정보 테이블'
            className="size-full overflow-y-auto overflow-x-auto">
            <CardContent className="p-2 sm:p-6">
                <div className="min-w-[800px] md:min-w-0">
                    <Table className="w-full">
                        <TableHeader>
                            <TableRow>
                                <TableHead className={`${TABLE_CELL_STYLE} text-xs sm:text-sm`}>코인</TableHead>
                                <TableHead className={`${TABLE_CELL_STYLE} text-xs sm:text-sm hidden sm:table-cell`}>보유수량</TableHead>
                                <TableHead className={`${TABLE_CELL_STYLE} text-xs sm:text-sm`}>평균단가</TableHead>
                                <TableHead className={`${TABLE_CELL_STYLE} text-xs sm:text-sm`}>현재가</TableHead>
                                <TableHead className={`${TABLE_CELL_STYLE} text-xs sm:text-sm`}>평가금액</TableHead>
                                <TableHead className={`${TABLE_CELL_STYLE} text-xs sm:text-sm`}>평가손익</TableHead>
                                <TableHead className={`${TABLE_CELL_STYLE} text-xs sm:text-sm`}>수익률</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {holdingsWithTickers.map((holding, index) => {
                                const evalAmount = holding.trade_price * holding.total_bid_volume;
                                const profit = evalAmount - holding.total_bid_amount;
                                const profitRate = holding.total_bid_amount !== 0 ? (profit / holding.total_bid_amount) * 100 : 0;

                                return (
                                    <TableRow key={index} className="text-xs sm:text-sm">
                                        <TableCell className={`${TABLE_CELL_STYLE} font-medium text-xs sm:text-sm`}>
                                            <div className="flex flex-col">
                                                <span className="font-semibold">{holding.market}</span>
                                                <span className="text-xs text-gray-500 sm:hidden">
                                                    {holding.total_bid_volume.toFixed(4)}개
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className={`${TABLE_CELL_STYLE} hidden sm:table-cell text-xs sm:text-sm`}>
                                            {holding.total_bid_volume.toFixed(6)}
                                        </TableCell>
                                        <TableCell className={`${TABLE_CELL_STYLE} text-xs sm:text-sm font-mono tracking-tight`}>
                                            <div className="min-w-0 overflow-hidden text-ellipsis">
                                                {holding.avg_bid_price.toLocaleString()}
                                            </div>
                                        </TableCell>
                                        <TableCell className={`${TABLE_CELL_STYLE} font-medium text-xs sm:text-sm font-mono tracking-tight`}>
                                            <div className="min-w-0 overflow-hidden text-ellipsis">
                                                {holding.trade_price.toLocaleString()}
                                            </div>
                                        </TableCell>
                                        <TableCell className={`${TABLE_CELL_STYLE} font-medium text-xs sm:text-sm font-mono tracking-tight`}>
                                            <div className="min-w-0 overflow-hidden text-ellipsis">
                                                {evalAmount.toLocaleString()}
                                            </div>
                                        </TableCell>
                                        <TableCell className={`${TABLE_CELL_STYLE} font-medium text-xs sm:text-sm font-mono tracking-tight ${profit > 0 ? 'text-positive' : profit < 0 ? 'text-negative' : ''
                                            }`}>
                                            <div className="min-w-0 overflow-hidden text-ellipsis">
                                                {profit.toLocaleString()}
                                            </div>
                                        </TableCell>
                                        <TableCell className={`${TABLE_CELL_STYLE} font-semibold text-xs sm:text-sm font-mono tracking-tight ${profitRate > 0 ? 'text-positive' : profitRate < 0 ? 'text-negative' : ''
                                            }`}>
                                            <div className="min-w-0 overflow-hidden text-ellipsis">
                                                {profitRate.toFixed(2)}%
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}