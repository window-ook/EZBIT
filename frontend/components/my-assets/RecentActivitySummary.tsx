import { getRecentActivitySummary } from '@/actions/supabase/my-assets/getRecentActivitySummary';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcn-ui/card";
import RecentActivitySummaryContent from '@/components/my-assets/RecentActivitySummaryContent';

export default async function RecentActivitySummary() {
    const result = await getRecentActivitySummary();

    if (!result.success || !result.data) {
        return (
            <Card
                aria-label='7일간 활동 요약(데이터 없음)'
                className="size-full">
                <CardHeader>
                    <CardTitle className="text-lg font-medium">7일간 활동</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex items-center justify-center">
                    <p className="text-gray-500">7일간 거래 내역이 없습니다.</p>
                </CardContent>
            </Card>
        );
    }

    return <RecentActivitySummaryContent initialSummary={result.data} />;
}