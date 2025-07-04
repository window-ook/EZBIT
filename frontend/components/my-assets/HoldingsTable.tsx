"use client";

import { Card, CardContent, CardHeader } from "@/components/shadcn-ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shadcn-ui/table";

const mockHoldings = [
    {
        name: "KRW-BTC",
        quantity: 10,
        avgPrice: 75000,
        currentPrice: 78000,
        totalValue: 780000,
        profitLoss: 30000,
        profitRate: 4.0,
    },
    {
        name: "KRW-ETH",
        quantity: 5,
        avgPrice: 120000,
        currentPrice: 115000,
        totalValue: 575000,
        profitLoss: -25000,
        profitRate: -4.17,
    },
    {
        name: "KRW-XRP",
        quantity: 3,
        avgPrice: 200000,
        currentPrice: 210000,
        totalValue: 630000,
        profitLoss: 30000,
        profitRate: 5.0,
    },
];

export function HoldingsTable() {
    return (
        <Card className="h-full">
            <CardHeader>
                <div className="px-6 flex justify-between text-xs text-slate-400">
                    <span>종목</span>
                    <span>보유수량</span>
                    <span>평균단가</span>
                    <span>현재가</span>
                    <span>평가금액</span>
                    <span>평가손익</span>
                    <span>수익률</span>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader className="sr-only">
                        <TableRow>
                            <TableHead>종목명</TableHead>
                            <TableHead>보유수량</TableHead>
                            <TableHead>평균단가</TableHead>
                            <TableHead>현재가</TableHead>
                            <TableHead>평가금액</TableHead>
                            <TableHead>평가손익</TableHead>
                            <TableHead>수익률</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {mockHoldings.map((holding, index) => (
                            <TableRow key={index} className="text-xs">
                                <TableCell className="font-medium">{holding.name}</TableCell>
                                <TableCell>{holding.quantity}</TableCell>
                                <TableCell>{holding.avgPrice.toLocaleString()}</TableCell>
                                <TableCell>{holding.currentPrice.toLocaleString()}</TableCell>
                                <TableCell>{holding.totalValue.toLocaleString()}</TableCell>
                                <TableCell className={holding.profitLoss >= 0 ? "text-red-600" : "text-blue-600"}>
                                    {holding.profitLoss >= 0 ? "+" : ""}
                                    {holding.profitLoss.toLocaleString()}
                                </TableCell>
                                <TableCell className={holding.profitRate >= 0 ? "text-red-600" : "text-blue-600"}>
                                    {holding.profitRate >= 0 ? "+" : ""}
                                    {holding.profitRate}%
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
