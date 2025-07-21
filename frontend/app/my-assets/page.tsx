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
                {/* 1행 */}
                <section className="h-40 flex gap-2">
                    <ErrorBoundaryWrapper
                        featureName='보유 자산 요약'
                        message='보유 자산 요약 로딩 중 문제가 발생했습니다.'
                    >
                        <Suspense fallback={<LoadingSpinner />}>
                            <HoldingsSummary />
                        </Suspense>
                    </ErrorBoundaryWrapper>
                    <ErrorBoundaryWrapper
                        featureName='자산 비중'
                        message='자산 비중 로딩 중 문제가 발생했습니다.'
                    >
                        <Suspense fallback={<LoadingSpinner />}>
                            <InvestmentChart />
                        </Suspense>
                    </ErrorBoundaryWrapper>
                </section>

                {/* 2행 */}
                <section className="h-40 flex gap-2">
                    <div className="w-1/2 h-full flex gap-2">
                        <ErrorBoundaryWrapper
                            featureName='유저 초기화'
                            message='유저 초기화 로딩 중 문제가 발생했습니다.'
                        >
                            <Suspense fallback={<LoadingSpinner />}>
                                <ResetUserButton />
                            </Suspense>
                        </ErrorBoundaryWrapper>
                        <ErrorBoundaryWrapper
                            featureName='최고 수익'
                            message='최고 수익 로딩 중 문제가 발생했습니다.'
                        >
                            <Suspense fallback={<LoadingSpinner />}>
                                <HighestEarning />
                            </Suspense>
                        </ErrorBoundaryWrapper>
                    </div>
                    <div className="w-1/2 h-full">
                        <ErrorBoundaryWrapper
                            featureName='최근 6개월 자산 흐름 차트'
                            message='최근 6개월 자산 흐름 로딩 중 문제가 발생했습니다.'
                        >
                            <Suspense fallback={<LoadingSpinner />}>
                                <SixMonthsFlowChart />
                            </Suspense>
                        </ErrorBoundaryWrapper>
                    </div>
                </section>

                {/* 3행 */}
                <section className="flex-1 w-full">
                    <ErrorBoundaryWrapper
                        featureName='보유 자산 테이블'
                        message='보유 자산 테이블 로딩 중 문제가 발생했습니다.'
                    >
                        <Suspense fallback={<LoadingSpinner />}>
                            <HoldingsTable />
                        </Suspense>
                    </ErrorBoundaryWrapper>
                </section>
            </main>
        </PrefetchedUserData>
    );
}