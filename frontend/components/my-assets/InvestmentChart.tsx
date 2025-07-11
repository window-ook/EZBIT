"use client";

import { ISupabaseHoldings } from '@/types/supabase/holdings';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/shadcn-ui/card";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/shadcn-ui/chart";
import { Pie, PieChart } from "recharts";
// import { useContext } from 'react';
// import { TickerContext } from '@/providers/TickerProvider';

export const description = "A simple pie chart";

// 종목별 색상 팔레트 선언 (최소 12개, 부족하면 반복)
const COLORS = [
    '#ef4444', // 빨강
    '#3b82f6', // 파랑
    '#10b981', // 초록
    '#f59e42', // 주황
    '#a78bfa', // 보라
    '#fbbf24', // 노랑
    '#6366f1', // 인디고
    '#14b8a6', // 청록
    '#eab308', // 금색
    '#f472b6', // 핑크
    '#64748b', // slate
    '#22d3ee', // 하늘
] as const;

export function InvestmentChart({ holdings }: { holdings: ISupabaseHoldings[] }) {
    // const { krwNames } = useContext(TickerContext);

    // data: name, value, fill
    const data = holdings.map((holding, idx) => ({
        name: holding.market,
        value: holding.total_bid_amount,
        fill: COLORS[idx % COLORS.length],
    }));

    // chartConfig: { [market]: { label, color } }
    const chartConfig = data.reduce<Record<string, { label: string; color: string }>>((acc, item) => {
        acc[item.name] = {
            label: item.name,
            color: item.fill,
        };
        return acc;
    }, {});

    return (
        <Card className="w-full h-full">
            <CardHeader className='flex shrink-0'>
                <CardTitle>투자현황</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center w-full h-full">
                <ChartContainer
                    config={chartConfig}
                    className="w-full h-full pb-10"
                >
                    <PieChart className='w-full h-full'>
                        <ChartTooltip
                            cursor={false}
                            content={props => <ChartTooltipContent {...props} />}
                        />
                        <Pie
                            data={data}
                            dataKey="value"
                            nameKey="name"
                            outerRadius='110%'
                            innerRadius='40%'
                            label
                        />
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
