"use client";

import { PieChart, Pie, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcn-ui/card";

const data = [
    { name: "수익", value: 65, fill: "#ef4444" },
    { name: "손실", value: 35, fill: "#3b82f6" },
];

export function InvestmentChart() {
    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="text-sm font-medium">투자 현황</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center items-center h-full">
                <PieChart>
                    <Pie data={data} cx="50%" cy="50%" innerRadius={25} outerRadius={45} paddingAngle={5} dataKey="value">
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                    </Pie>
                </PieChart>
            </CardContent>
        </Card>
    );
}
