import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcn-ui/card";

export default function HighestEarning() {
    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="text-lg">최고 수익률 코인</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col h-full">
                <span className="text-lg font-semibold">KRW-XRP</span>
                <span className="text-xl text-red-500">20%</span>
            </CardContent>
        </Card>
    );
}

