"use client";

import { useHoldings } from '@/hooks/supabase/holdings/useHoldings';
import { ChartContainer, ChartTooltip, ChartTooltipContent, } from "@/components/shadcn-ui/chart";
import { Card } from "@/components/shadcn-ui/card";
import { Pie, PieChart } from "recharts";

const COLORS = [
    '#ef4444',
    '#3b82f6',
    '#10b981',
    '#f59e42',
    '#a78bfa',
    '#fbbf24',
    '#6366f1',
    '#14b8a6',
    '#eab308',
    '#f472b6',
    '#64748b',
    '#22d3ee',
] as const;

export default function InvestmentChart() {
    const { holdings } = useHoldings();

    if (!holdings.length)
        return (
            <Card
                aria-label='자산 비중 차트(코인 없음)'
                className="relative w-1/2 h-full flex items-center justify-center">
                <span className="text-base text-muted-foreground">현재 보유 중인 코인이 없습니다.</span>
            </Card>
        );

    const data = holdings.map((holding, idx) => ({
        name: holding.market,
        value: holding.total_bid_amount,
        fill: COLORS[idx % COLORS.length],
    }));

    const chartConfig = data.reduce<Record<string, { label: string; color: string }>>((acc, item) => {
        acc[item.name] = {
            label: item.name,
            color: item.fill,
        };
        return acc;
    }, {});

    return (
        <Card
            aria-label='자산 비중 차트'
            className="relative w-full h-full p-3">
            <dt className='text-lg font-medium'>매수 비중</dt>
            <ChartContainer
                config={chartConfig}
                className="w-full h-full"
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
                        outerRadius='60%'
                        innerRadius='20%'
                        label
                    />
                </PieChart>
            </ChartContainer>
        </Card>
    );
}
