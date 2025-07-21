"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcn-ui/card";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { Suspense } from 'react';
import { Skeleton } from '@/components/trends/Skeleton';
import { useUser } from '@/hooks/supabase/useUser';
import { useHoldings } from '@/hooks/supabase/useHoldings';

function SixMonthsFlowChartContent() {
    const { user } = useUser();
    const { holdings } = useHoldings();

    if (!user?.user_id) {
        return (
            <Card className="w-full h-full">
                <CardHeader>
                    <CardTitle className="text-lg font-medium">최근 6개월 총 자산 흐름</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex items-center justify-center">
                    <p className="text-gray-500">로그인이 필요합니다</p>
                </CardContent>
            </Card>
        );
    }

    // 데이터가 없는 경우 현재 자산을 마지막 월에 표시
    const currentMonth = new Date().toLocaleDateString('ko-KR', { month: 'short' });
    const totalAssets = holdings?.reduce((acc, curr) => acc + curr.total_bid_amount, 0) || 0;

    const chartData = [{
        month: currentMonth,
        total_assets: (user?.holding_krw || 0) + totalAssets,
        total_krw: user?.holding_krw || 0,
        total_crypto_value: totalAssets,
        snapshot_date: new Date().toISOString().split('T')[0]
    }];

    return (
        <Card className="w-full h-full">
            <CardHeader>
                <CardTitle className="text-lg font-medium">최근 6개월 총 자산 흐름</CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
                <div className="h-full pr-10">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
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
                                dataKey="total_assets"
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

export default function SixMonthsFlowChart() {
    return (
        <Suspense fallback={<Skeleton height="h-full" />}>
            <SixMonthsFlowChartContent />
        </Suspense>
    );
}