import { Metadata } from 'next';
import { HoldingsTable } from '@/components/my-assets/HoldingsTable';
import { HoldingsSummary } from '@/components/my-assets/HoldingSummary';
import { InvestmentChart } from '@/components/my-assets/InvestmentChart';
import { SixMonthsFlowChart } from '@/components/my-assets/SixMonthsFlowChart';
import { getHoldings } from '@/actions/supabase/getHoldings';
import { createServerSupabaseClient } from '@/utils/supabase/server';
import { getUserData } from '@/actions/supabase/getUserData';
import HighestEarning from '@/components/my-assets/HighestEarning';
import ResetAssetsButton from '@/components/my-assets/ResetAssetsButton';

export const metadata: Metadata = {
    title: '보유 자산 : EZBIT',
    description: '보유 자산을 확인하세요',
    keywords: ['보유 자산', 'EZBIT', '투자', '손익', '수익률'],
};

export const dynamic = 'force-dynamic';

export default async function MyAssetsPage() {
    const supabase = await createServerSupabaseClient();

    const { data: { session } } = await supabase.auth.getSession();

    if (!session) return null;

    const holdings = await getHoldings();
    const user = await getUserData();

    return (
        <main className="h-full w-full flex flex-col gap-2">
            {/* 1행 */}
            <section className="h-40 flex gap-2">
                <div className="w-1/2 h-full flex flex-col gap-2">
                    <HoldingsSummary holdings={holdings} user={user!} />
                </div>
                <div className="w-1/2 h-full">
                    <InvestmentChart holdings={holdings} />
                </div>
            </section>

            {/* 2행 */}
            <section className="h-40 flex gap-2">
                <div className="w-1/2 h-full flex gap-2">
                    <ResetAssetsButton />
                    <div className="w-full h-full">
                        <HighestEarning holdings={holdings} />
                    </div>
                </div>
                <div className="w-1/2 h-full">
                    <SixMonthsFlowChart />
                </div>
            </section>

            {/* 3행 */}
            <section className="flex-1 w-full">
                <HoldingsTable holdings={holdings} />
            </section>
        </main>
    );
}