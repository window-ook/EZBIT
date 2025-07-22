import { Metadata } from 'next';
import { ErrorBoundaryWrapper } from '@/components/shared/ErrorBoundaryWrapper';
import { Suspense } from 'react';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import HoldingsTable from '@/components/my-assets/HoldingsTable';
import HoldingsSummary from '@/components/my-assets/HoldingSummary';
import InvestmentChart from '@/components/my-assets/InvestmentChart';
import SixMonthsFlowChart from '@/components/my-assets/SixMonthsFlowChart';
import HighestEarning from '@/components/my-assets/HighestEarning';
import ResetUserButton from '@/components/my-assets/ResetUserButton';
import PrefetchedUserData from '@/components/shared/PrefetchedUserData';

export const metadata: Metadata = {
    title: '보유 자산 : EZBIT',
    description: '보유 자산을 확인하세요',
    keywords: ['보유 자산', 'EZBIT', '투자', '손익', '수익률'],
};

export const dynamic = 'force-dynamic';

export default function MyAssetsPage() {
    return (
        <PrefetchedUserData>
            <main className="h-full w-full flex flex-col gap-2">
                {/* 1행 - 자산 요약 섹션 */}
                <ErrorBoundaryWrapper
                    featureName='자산 요약'
                    message='자산 요약 정보 로딩 중 문제가 발생했습니다.'
                >
                    <section className="h-40 flex gap-2">
                        <Suspense fallback={<LoadingSpinner size='xl' />}>
                            <HoldingsSummary />
                        </Suspense>
                        <Suspense fallback={<LoadingSpinner size='xl' />}>
                            <InvestmentChart />
                        </Suspense>
                    </section>
                </ErrorBoundaryWrapper>

                {/* 2행 - 자산 상세 정보 섹션 */}
                <ErrorBoundaryWrapper
                    featureName='자산 상세 정보'
                    message='자산 상세 정보 로딩 중 문제가 발생했습니다.'
                >
                    <section className="h-40 flex gap-2">
                        <div className="w-1/2 h-full flex gap-2">
                            <Suspense fallback={<LoadingSpinner size='xl' />}>
                                <ResetUserButton />
                            </Suspense>
                            <Suspense fallback={<LoadingSpinner size='xl' />}>
                                <HighestEarning />
                            </Suspense>
                        </div>
                        <div className="w-1/2 h-full">
                            <Suspense fallback={<LoadingSpinner size='xl' />}>
                                <SixMonthsFlowChart />
                            </Suspense>
                        </div>
                    </section>
                </ErrorBoundaryWrapper>

                {/* 3행 - 보유 자산 테이블 섹션 */}
                <ErrorBoundaryWrapper
                    featureName='보유 자산 테이블'
                    message='보유 자산 테이블 로딩 중 문제가 발생했습니다.'
                >
                    <section className="flex-1 w-full">
                        <Suspense fallback={<LoadingSpinner size='xl' />}>
                            <HoldingsTable />
                        </Suspense>
                    </section>
                </ErrorBoundaryWrapper>
            </main>
        </PrefetchedUserData>
    );
}