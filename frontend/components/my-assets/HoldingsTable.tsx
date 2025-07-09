'use client';

import { Card, CardContent } from "@/components/shadcn-ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shadcn-ui/table";
import { ISupabaseHoldings } from "@/types/supabase/holdings";

export function HoldingsTable({ holdings }: { holdings: ISupabaseHoldings[] }) {
    return (
        <Card className="w-full h-full">
            <CardContent>
                <Table className="w-full table-fixed">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-1/7 text-center">종목</TableHead>
                            <TableHead className="w-1/7 text-center">보유수량</TableHead>
                            <TableHead className="w-1/7 text-center">평균단가</TableHead>
                            <TableHead className="w-1/7 text-center">현재가</TableHead>
                            <TableHead className="w-1/7 text-center">평가금액</TableHead>
                            <TableHead className="w-1/7 text-center">평가손익</TableHead>
                            <TableHead className="w-1/7 text-center">수익률</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {holdings.map((holding, index) => (
                            <TableRow key={index} className="text-xs">
                                <TableCell className="w-1/7 text-center">{holding.market}</TableCell>
                                <TableCell className="w-1/7 text-center">{holding.total_bid_volume}</TableCell>
                                <TableCell className="w-1/7 text-center">{holding.avg_bid_price.toLocaleString()}</TableCell>
                                <TableCell className="w-1/7 text-center">1000000</TableCell>
                                <TableCell className="w-1/7 text-center">1000000</TableCell>
                                <TableCell className="w-1/7 text-center">1000000</TableCell>
                                <TableCell className="w-1/7 text-center">10%</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
