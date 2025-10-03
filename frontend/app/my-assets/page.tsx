import { Metadata } from 'next';
import { Suspense } from 'react';
import HoldingsTable from '@/components/my-assets/HoldingsTable';
import HoldingsSummary from '@/components/my-assets/HoldingSummary';
import InvestmentChart from '@/components/my-assets/InvestmentChart';
import PortfolioAnalysis from '@/components/my-assets/PortfolioAnalysis';
import InitializeUserButton from '@/components/my-assets/InitializeUserButton';
import RecentActivitySummary from '@/components/my-assets/RecentActivitySummary';
import RecentActivityFallback from '@/components/my-assets/RecentActivityFallback';

export const metadata: Metadata = {
    title: '보유 자산 : EZBIT',
    description: '보유 자산을 확인하세요',
    keywords: ['보유 자산', 'EZBIT', '투자', '손익', '수익률'],
};

export default function MyAssetsPage() {
    return (
        <main className="h-full w-full flex flex-col gap-2">
            {/* 1행 - 자산 요약 2박스, 매수 비중 차트 */}
            <section className="min-h-40 grid grid-cols-1 md:grid-cols-2 gap-2">
                <HoldingsSummary />
                <InvestmentChart />
            </section>

            {/* 2행 - 유저 정보 초기화 버튼, 포트폴리오 분석, 7일간 활동 요약 */}
            <section className="min-h-40 grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="w-full grid grid-cols-2 gap-2">
                    <InitializeUserButton />
                    <PortfolioAnalysis />
                </div>
                <Suspense fallback={<RecentActivityFallback />}>
                    <RecentActivitySummary />
                </Suspense>
            </section>

            {/* 3행 - 보유 자산 테이블 */}
            <section className="flex-1 w-full">
                <HoldingsTable />
            </section>
        </main>
    );
}