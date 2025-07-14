import { Metadata } from 'next';
import HoldingsTable from '@/components/my-assets/HoldingsTable';
import HoldingsSummary from '@/components/my-assets/HoldingSummary';
import InvestmentChart from '@/components/my-assets/InvestmentChart';
import SixMonthsFlowChart from '@/components/my-assets/SixMonthsFlowChart';
import HighestEarning from '@/components/my-assets/HighestEarning';
import ResetUserButton from '@/components/my-assets/ResetUserButton';
import PrefetchedUserAndHoldings from '@/components/shared/PrefetchedUserAndHoldings';
import { Suspense } from 'react';
import { HoldingsSummaryErrorFallback } from '@/components/my-assets/HoldingsSummaryErrorFallback';
import { InvestmentChartErrorFallback } from '@/components/my-assets/InvestmentChartErrorFallback';
import { ResetUserButtonErrorFallback } from '@/components/my-assets/ResetUserButtonErrorFallback';
import { HighestEarningErrorFallback } from '@/components/my-assets/HighestEarningErrorFallback';
import { SixMonthsFlowChartErrorFallback } from '@/components/my-assets/SixMonthsFlowChartErrorFallback';
import { HoldingsTableErrorFallback } from '@/components/my-assets/HoldingsTableErrorFallback';
import { ErrorBoundary } from 'react-error-boundary';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

export const metadata: Metadata = {
    title: '보유 자산 : EZBIT',
    description: '보유 자산을 확인하세요',
    keywords: ['보유 자산', 'EZBIT', '투자', '손익', '수익률'],
};

export const dynamic = 'force-dynamic';

export default function MyAssetsPage() {
    return (
        <PrefetchedUserAndHoldings>
            <main className="h-full w-full flex flex-col gap-2">
                {/* 1행 */}
                <section className="h-40 flex gap-2">
                    <ErrorBoundary FallbackComponent={HoldingsSummaryErrorFallback}>
                        <Suspense fallback={<LoadingSpinner />}>
                            <HoldingsSummary />
                        </Suspense>
                    </ErrorBoundary>
                    <ErrorBoundary FallbackComponent={InvestmentChartErrorFallback}>
                        <Suspense fallback={<LoadingSpinner />}>
                            <InvestmentChart />
                        </Suspense>
                    </ErrorBoundary>
                </section>

                {/* 2행 */}
                <section className="h-40 flex gap-2">
                    <div className="w-1/2 h-full flex gap-2">
                        <ErrorBoundary FallbackComponent={ResetUserButtonErrorFallback}>
                            <Suspense fallback={<LoadingSpinner />}>
                                <ResetUserButton />
                            </Suspense>
                        </ErrorBoundary>
                        <ErrorBoundary FallbackComponent={HighestEarningErrorFallback}>
                            <Suspense fallback={<LoadingSpinner />}>
                                <HighestEarning />
                            </Suspense>
                        </ErrorBoundary>
                    </div>
                    <div className="w-1/2 h-full">
                        <ErrorBoundary FallbackComponent={SixMonthsFlowChartErrorFallback}>
                            <Suspense fallback={<LoadingSpinner />}>
                                <SixMonthsFlowChart />
                            </Suspense>
                        </ErrorBoundary>
                    </div>
                </section>

                {/* 3행 */}
                <section className="flex-1 w-full">
                    <ErrorBoundary FallbackComponent={HoldingsTableErrorFallback}>
                        <Suspense fallback={<LoadingSpinner />}>
                            <HoldingsTable />
                        </Suspense>
                    </ErrorBoundary>
                </section>
            </main>
        </PrefetchedUserAndHoldings>
    );
}