'use client';

import { Card, CardContent } from "@/components/shadcn-ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shadcn-ui/table";
import { ISupabaseHoldings } from "@/types/supabase/holdings";
import { TABLE_CELL_STYLE } from '@/utils/shared/styles';

export function HoldingsTable({ holdings }: { holdings: ISupabaseHoldings[] }) {
    return (
        <Card className="w-full h-full">
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
                        {holdings.map((holding, index) => (
                            <TableRow key={index} className="text-xs">
                                <TableCell className={TABLE_CELL_STYLE}>{holding.market}</TableCell>
                                <TableCell className={TABLE_CELL_STYLE}>{holding.total_bid_volume}</TableCell>
                                <TableCell className={TABLE_CELL_STYLE}>{holding.avg_bid_price.toLocaleString()}</TableCell>
                                <TableCell className={TABLE_CELL_STYLE}>1000000</TableCell>
                                <TableCell className={TABLE_CELL_STYLE}>1000000</TableCell>
                                <TableCell className={TABLE_CELL_STYLE}>1000000</TableCell>
                                <TableCell className={TABLE_CELL_STYLE}>10%</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}