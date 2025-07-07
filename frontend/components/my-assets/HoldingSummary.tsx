"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcn-ui/card";

interface IHoldingsSummary {
    title: string
    subTitle?: string
    amount: string
    contents: {
        title: string
        amount: string
    }[]
}

export function HoldingsSummary({ title, subTitle, amount, contents }: IHoldingsSummary) {
    return (
        <Card className="h-full">
            <CardHeader>
                <div>
                    <CardTitle className="text-lg font-medium">{title}</CardTitle>
                    <div className="text-xs text-description">{subTitle}</div>
                </div>
                <div className="text-lg font-bold">{amount}</div>
            </CardHeader>
            <CardContent>
                {contents.map((content, index) => (
                    <div className="flex items-center gap-1" key={index}>
                        <div className="text-xs text-description">{content.title}</div>
                        <div className="text font-medium">{content.amount}</div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
