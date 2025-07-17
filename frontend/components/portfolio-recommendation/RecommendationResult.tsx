'use client';

import { Card } from '@/components/shadcn-ui/card';

export default function RecommendationResult() {
    return (
        <Card className="flex flex-col gap-2 p-4">
            <span className="text-2xl font-bold text-main">포트폴리오 구성 결과</span>
        </Card>
    );
}