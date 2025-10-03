import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcn-ui/card";

export default function RecentActivityFallback() {
    return (
        <Card
            aria-label='7일간 활동 요약(로딩중)'
            className="size-full">
            <CardHeader>
                <CardTitle className="text-lg font-medium">7일간 활동 요약</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex items-center justify-center">
                <LoadingSpinner size='xl' />
            </CardContent>
        </Card>
    );
}