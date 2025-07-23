import { Metadata } from 'next';
import { ErrorBoundaryWrapper } from '@/components/shared/ErrorBoundaryWrapper';
import { Suspense } from 'react';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import CandleChart from '@/components/exchange/CandleChart';
import MarketDetailCard from '@/components/exchange/MarketDetailCard';
import OrderbookTable from '@/components/exchange/OrderbookTable';
import OrderForm from '@/components/exchange/OrderForm';
import TradeHistoryTable from '@/components/exchange/TradeHistoryTable';
import PrefetchedUserData from '@/components/shared/PrefetchedUserData';

export const metadata: Metadata = {
    title: '거래소 : EZBIT',
    description: '실시간 차트를 확인하고 코인을 주문하세요',
    keywords: ['코인', '거래소', '차트', '주문'],
};

export const dynamic = 'force-dynamic';

export default async function ExchangePage() {
    return (
        <main className="h-full flex flex-col gap-2">
            <MarketDetailCard />
            <CandleChart />

            <section className='flex flex-col md:flex-row gap-2'>
                <OrderbookTable />
                <ErrorBoundaryWrapper
                    featureName="주문하기"
                    message="주문가능 금액 로딩 중 문제가 발생했습니다."
                >
                    <Suspense fallback={<LoadingSpinner size='2xl' />}>
                        <PrefetchedUserData>
                            <OrderForm />
                        </PrefetchedUserData>
                    </Suspense>
                </ErrorBoundaryWrapper>
            </section>

            <section className='flex-1 overflow-y-auto'>
                <TradeHistoryTable />
            </section>
        </main>
    );
}