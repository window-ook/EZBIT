import { Metadata } from 'next';
import { HoldingsTable } from '@/components/my-assets/HoldingsTable';
import { HoldingsSummary } from '@/components/my-assets/HoldingSummary';
import { InvestmentChart } from '@/components/my-assets/InvestmentChart';
import { InvestmentStatement } from '@/components/my-assets/InvestmentStatement';
import { SixMonthsFlowChart } from '@/components/my-assets/SixMonthsFlowChart';
import HighestEarning from '@/components/my-assets/HighestEarning';
import ErrorBoundaryAndSuspense from '@/components/shared/ErrorBoundaryAndSuspense';
import PrefetchedHoldingsTable from '@/components/my-assets/PrefetchedHoldingsTable';

export const metadata: Metadata = {
    title: '보유 자산 : EZBIT',
    description: '보유 자산을 확인하세요',
    keywords: ['보유 자산', 'EZBIT', '투자', '손익', '수익률'],
};

export const dynamic = 'force-dynamic';

const HOLDING_KRW = [{ title: '총 매수', amount: '1,000,000' }, { title: '총 평가', amount: '12,000,102' }];
const TOTAL_ASSETS = [{ title: '평가손익', amount: '3,650,000' }, { title: '수익률', amount: '10%' }];

export default function MyAssetsPage() {
    return (
        <main className="h-full w-full grid grid-cols-2 grid-rows-2 gap-2">
            <section className="col-start-1 row-start-1 grid grid-cols-2 gap-2">
                <HoldingsSummary
                    title="보유 KRW"
                    subTitle="주문가능 KRW"
                    amount="2,500,000"
                    contents={HOLDING_KRW}
                />
                <HoldingsSummary
                    title="총 보유자산"
                    subTitle="보유 KRW + 총 매수"
                    amount="3,650,000"
                    contents={TOTAL_ASSETS}
                />
                <HighestEarning />
                <InvestmentStatement />
            </section>

            <section className="col-start-2 grid grid-rows-2 gap-2">
                <InvestmentChart />
                <SixMonthsFlowChart />
            </section>

            <section className="w-full col-span-2">
                <ErrorBoundaryAndSuspense
                    fallbackTitle="보유 자산 조회 실패"
                    fallbackDesc="보유 자산 조회에 실패했습니다."
                >
                    <PrefetchedHoldingsTable
                    >
                        <HoldingsTable />
                    </PrefetchedHoldingsTable>
                </ErrorBoundaryAndSuspense>
            </section>
        </main>
    );
}