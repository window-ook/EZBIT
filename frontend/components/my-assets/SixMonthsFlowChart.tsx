"use client";

import { useQueryClient } from '@tanstack/react-query';
import { userQuery } from '@/queries/supabase/user.query';
import { ISupabaseUser } from '@/types/supabase/user';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcn-ui/card";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { ISupabaseHoldings } from '@/types/supabase/holdings';
import { holdingsQuery } from '@/queries/supabase/holdings.query';

export default function SixMonthsFlowChart() {
    const queryClient = useQueryClient();

    const user = queryClient.getQueryData<ISupabaseUser>(userQuery.all());
    const holdings = queryClient.getQueryData<ISupabaseHoldings[]>(holdingsQuery.all());

    const totalAssets = holdings?.reduce((acc, curr) => acc + curr.total_bid_amount, 0);

    const flowData = [
        { month: "2월", totalAssets: 0 },
        { month: "3월", totalAssets: 0 },
        { month: "4월", totalAssets: 0 },
        { month: "5월", totalAssets: 0 },
        { month: "6월", totalAssets: 0 },
        { month: "7월", totalAssets: (user?.holding_krw || 0) + (totalAssets || 0) },
    ];

    return (
        <Card className="w-full h-full">
            <CardHeader>
                <CardTitle className="text-lg font-medium">최근 6개월 총 자산 흐름</CardTitle>
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
                                formatter={(value: number) => [`${value.toLocaleString()}원`]}
                                labelStyle={{ color: "#000" }}
                                contentStyle={{
                                    backgroundColor: "white",
                                    border: "2px solid #ccc",
                                    borderRadius: "8px",
                                }}
                            />
                            <Line
                                type="monotone"
                                dataKey="totalAssets"
                                stroke="var(--color-main-dark)"
                                strokeWidth={2}
                                dot={{ fill: "var(--color-main-dark)", strokeWidth: 2, r: 3 }}
                                activeDot={{ r: 4, stroke: "var(--color-main-dark)", strokeWidth: 2 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}