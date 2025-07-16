'use client';

import { Card } from '@/components/shadcn-ui/card';

export default function DailyTopBidCoins() {
    return (
        <Card className="w-full h-1/2 p-4 flex flex-col gap-4">
            <h2 className="mb-2 text-xl sm:text-2xl font-bold text-main">일 매수 체결강도 TOP 5</h2>
        </Card>
    );
}