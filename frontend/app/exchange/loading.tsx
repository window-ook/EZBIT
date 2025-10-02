import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Card } from "@/components/shadcn-ui/card";

export default function ExchangeLoading() {
    return (
        <main className="h-full flex flex-col gap-2">
            <Card className="w-full h-[10rem] flex items-center justify-center">
                <LoadingSpinner size="2xl" />
            </Card>

            <Card className="w-full h-[400px] flex items-center justify-center">
                <LoadingSpinner size="2xl" />
            </Card>

            <section className="flex flex-col md:flex-row justify-center gap-2">
                <Card className="w-full h-[26rem] flex items-center justify-center">
                    <LoadingSpinner size="2xl" />
                </Card>
                <Card className="w-full h-[26rem] flex items-center justify-center">
                    <LoadingSpinner size="2xl" />
                </Card>
            </section>

            <section className="flex-1 overflow-y-auto flex justify-center">
                <Card className="w-full flex items-center justify-center">
                    <LoadingSpinner size="2xl" />
                </Card>
            </section>
        </main>
    );
}