"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcn-ui/card";

const BOX_STYLE = 'flex justify-between text-xs';

export function InvestmentStatement() {
    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="text-lg">투자손익</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                <div className={BOX_STYLE}>
                    <span className="text-muted-foreground">총 투자금액</span>
                    <span>1,000,000원</span>
                </div>
                <div className={BOX_STYLE}>
                    <span className="text-muted-foreground">현재 평가금액</span>
                    <span>1,150,000원</span>
                </div>
                <div className={BOX_STYLE}>
                    <span className="text-muted-foreground">평가손익</span>
                    <span className="text-green-600">+150,000원</span>
                </div>
                <div className={BOX_STYLE}>
                    <span className="text-muted-foreground">수익률</span>
                    <span className="text-green-600">+15.0%</span>
                </div>
            </CardContent>
        </Card>
    );
}