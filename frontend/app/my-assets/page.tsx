import { Metadata } from 'next';
import { HoldingsTable } from '@/components/my-assets/HoldingsTable';
import { HoldingsSummary } from '@/components/my-assets/HoldingSummary';
import { InvestmentChart } from '@/components/my-assets/InvestmentChart';
import { SixMonthsFlowChart } from '@/components/my-assets/SixMonthsFlowChart';
import HighestEarning from '@/components/my-assets/HighestEarning';
import ResetUserButton from '@/components/my-assets/ResetUserButton';
import PrefetchedUserAndHoldings from '@/components/shared/PrefetchedUserAndHoldings';

export const metadata: Metadata = {
    title: '보유 자산 : EZBIT',
    description: '보유 자산을 확인하세요',
    keywords: ['보유 자산', 'EZBIT', '투자', '손익', '수익률'],
};

export default function MyAssetsPage() {
    return (
        <PrefetchedUserAndHoldings>
            <main className="h-full w-full flex flex-col gap-2">
                {/* 1행 */}
                <section className="h-40 flex gap-2">
                    <HoldingsSummary />
                    <InvestmentChart />
                </section>

                {/* 2행 */}
                <section className="h-40 flex gap-2">
                    <div className="w-1/2 h-full flex gap-2">
                        <ResetUserButton />
                        <HighestEarning />
                    </div>
                    <div className="w-1/2 h-full"><SixMonthsFlowChart /></div>
                </section>

                {/* 3행 */}
                <section className="flex-1 w-full"><HoldingsTable /></section>
            </main>
        </PrefetchedUserAndHoldings>
    );
}