import { Metadata } from 'next';
import { ErrorBoundaryWrapper } from '@/components/shared/ErrorBoundaryWrapper';
import { Suspense } from 'react';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import CandleChart from '@/components/exchange/CandleChart';
import MarketDetailCard from '@/components/exchange/MarketDetailCard';
import OrderForm from '@/components/exchange/OrderForm';
import UserDataPrefetcher from '@/components/shared/UserDataPrefetcher';
import TradeHistoryTable from '@/components/exchange/TradeHistoryTable';
import OrderbookTable from '@/components/exchange/OrderbookTable';
import ExchangeStatusManager from '@/components/exchange/ExchangeStatusManager';

export const metadata: Metadata = {
    title: '거래소 : EZBIT',
    description: '실시간 차트를 확인하고 코인을 주문하세요',
    keywords: ['코인', '거래소', '차트', '주문'],
};

export const experimental_ppr = true;

export default async function ExchangePage() {
    return (
        <main className="h-full flex flex-col gap-2">
            {/* 웹소켓 연결 상태 관리 */}
            <ExchangeStatusManager />

            {/* 코인 상세 정보 */}
            <MarketDetailCard />

            {/* 캔들 차트 */}
            <CandleChart />

            {/* 오더북 테이블 */}
            {/* 주문하기 폼 */}
            <section className='flex flex-col md:flex-row justify-center gap-2'>
                <ErrorBoundaryWrapper
                    featureName="오더북 테이블"
                    message="오더북 테이블 로딩 중 문제가 발생했습니다."
                >
                    <Suspense fallback={<LoadingSpinner size='2xl' />}>
                        <OrderbookTable />
                    </Suspense>
                </ErrorBoundaryWrapper>
                <ErrorBoundaryWrapper
                    featureName="주문하기 폼"
                    message="주문하기 폼 로딩 중 문제가 발생했습니다."
                >
                    <Suspense fallback={<LoadingSpinner size='2xl' />}>
                        <UserDataPrefetcher>
                            <OrderForm />
                        </UserDataPrefetcher>
                    </Suspense>
                </ErrorBoundaryWrapper>
            </section>

            {/* 체결내역 테이블 */}
            <section className='flex-1 overflow-y-auto flex justify-center'>
                <ErrorBoundaryWrapper
                    featureName="체결내역 테이블"
                    message="체결내역 테이블 로딩 중 문제가 발생했습니다."
                >
                    <Suspense fallback={<LoadingSpinner size='2xl' />}>
                        <TradeHistoryTable />
                    </Suspense>
                </ErrorBoundaryWrapper>
            </section>
        </main>
    );
}