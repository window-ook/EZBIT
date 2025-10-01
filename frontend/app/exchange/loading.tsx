import { Card } from "@/components/shadcn-ui/card";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

export default function ExchangeLoading() {
    return (
        <div className="flex flex-col gap-4 p-4">
            <Card className="w-full h-[26rem] p-4 flex items-center justify-center">
                <LoadingSpinner size="2xl" />
            </Card>
            <Card className="w-full h-[15rem] md:h-full p-4 flex items-center justify-center">
                <LoadingSpinner size="2xl" />
            </Card>
        </div>
    );
}