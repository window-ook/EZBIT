"use client";

import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcn-ui/card";

const flowData = [
    { month: "1월", totalAssets: 1000000 },
    { month: "2월", totalAssets: 1050000 },
    { month: "3월", totalAssets: 980000 },
    { month: "4월", totalAssets: 1120000 },
    { month: "5월", totalAssets: 1180000 },
    { month: "6월", totalAssets: 1250000 },
];

export function SixMonthsFlowChart() {
    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="text-lg font-medium">최근 6개월 총 자산 플로우 차트</CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
                <div className="h-full pr-10">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={flowData}>
                            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10 }}
                                tickFormatter={(value: number) => `${(value / 10000).toFixed(0)}만`}
                            />
                            <Tooltip
                                formatter={(value: number) => [`${value.toLocaleString()}원`, "총 자산"]}
                                labelStyle={{ color: "#000" }}
                                contentStyle={{
                                    backgroundColor: "white",
                                    border: "1px solid #ccc",
                                    borderRadius: "4px",
                                }}
                            />
                            <Line
                                type="monotone"
                                dataKey="totalAssets"
                                stroke="#22c55e"
                                strokeWidth={2}
                                dot={{ fill: "#22c55e", strokeWidth: 2, r: 3 }}
                                activeDot={{ r: 4, stroke: "#22c55e", strokeWidth: 2 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}