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
import UserDataPrefetcher from '@/components/shared/UserDataPrefetcher';

export const metadata: Metadata = {
    title: '보유 자산 : EZBIT',
    description: '보유 자산을 확인하세요',
    keywords: ['보유 자산', 'EZBIT', '투자', '손익', '수익률'],
};

export const experimental_ppr = true;

export default function MyAssetsPage() {
    return (
        <UserDataPrefetcher>
            <main className="h-full w-full flex flex-col gap-2">
                {/* 1행 - 자산 요약, 매수 비중 차트 */}
                <ErrorBoundaryWrapper
                    featureName='자산 요약'
                    message='자산 요약 정보 로딩 중 문제가 발생했습니다.'
                >
                    <section className="min-h-40 grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div className="w-full">
                            <Suspense fallback={<LoadingSpinner size='xl' />}>
                                <HoldingsSummary />
                            </Suspense>
                        </div>
                        <div className="w-full">
                            <Suspense fallback={<LoadingSpinner size='xl' />}>
                                <InvestmentChart />
                            </Suspense>
                        </div>
                    </section>
                </ErrorBoundaryWrapper>

                {/* 2행 - 계정 초기화 버튼, 최소 수익률 코인, 6개월 흐름 차트 */}
                <ErrorBoundaryWrapper
                    featureName='자산 상세 정보'
                    message='자산 상세 정보 로딩 중 문제가 발생했습니다.'
                >
                    <section className="min-h-40 grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div className="w-full grid grid-cols-2 gap-2">
                            <div className="w-full">
                                <Suspense fallback={<LoadingSpinner size='xl' />}>
                                    <ResetUserButton />
                                </Suspense>
                            </div>
                            <div className="w-full">
                                <Suspense fallback={<LoadingSpinner size='xl' />}>
                                    <HighestEarning />
                                </Suspense>
                            </div>
                        </div>
                        <div className="w-full">
                            <Suspense fallback={<LoadingSpinner size='xl' />}>
                                <SixMonthsFlowChart />
                            </Suspense>
                        </div>
                    </section>
                </ErrorBoundaryWrapper>

                {/* 3행 - 보유 자산 테이블 */}
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
        </UserDataPrefetcher>
    );
}