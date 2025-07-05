"use client";

import { PieChart, Pie, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcn-ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/shadcn-ui/chart';

const data = [
    { name: "수익", value: 65, fill: "#ef4444" },
    { name: "손실", value: 35, fill: "#3b82f6" },
];

const chartConfig = {
    profit: {
        label: "수익",
        color: "#ef4444",
    },
    loss: {
        label: "손실",
        color: "#3b82f6",
    },
};

export function InvestmentChart() {
    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="text-lg font-semibold">투자 현황</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center items-center h-full">
                <ChartContainer config={chartConfig} className="h-full">
                    <PieChart className="size-full">
                        <Pie data={data} cx="50%" cy="50%" innerRadius={25} outerRadius={45} paddingAngle={5} dataKey="value">
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                        </Pie>
                        <ChartTooltip
                            content={props => <ChartTooltipContent {...props} />} />
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
