import { Metadata } from 'next';
import { ErrorBoundaryWrapper } from '@/components/shared/ErrorBoundaryWrapper';
import { Suspense } from 'react';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import CandleChart from '@/components/exchange/CandleChart';
import MarketDetailCard from '@/components/exchange/MarketDetailCard';
import OrderbookTable from '@/components/exchange/OrderbookTable';
import OrderBox from '@/components/exchange/OrderBox';
import TradeHistoryTable from '@/components/exchange/TradeHistoryTable';
import PrefetchedUserAndHoldings from '@/components/shared/PrefetchedUserAndHoldings';

export const metadata: Metadata = {
    title: '거래소 : EZBIT',
    description: '실시간 차트를 확인하고 코인을 주문하세요',
    keywords: ['코인', '거래소', '차트', '주문'],
};

export const dynamic = 'force-dynamic';

export default async function ExchangePage() {
    return (
        <div className="flex flex-col gap-2 h-full">
            <MarketDetailCard />
            <CandleChart />
            <section className='grid grid-cols-2 gap-2'>
                <OrderbookTable />
                <ErrorBoundaryWrapper
                    featureName="주문하기"
                    message="유저 데이터 또는 보유 자산 로딩 중 문제가 발생했습니다."
                >
                    <Suspense fallback={<LoadingSpinner />}>
                        <PrefetchedUserAndHoldings>
                            <OrderBox />
                        </PrefetchedUserAndHoldings>
                    </Suspense>
                </ErrorBoundaryWrapper>
            </section>
            <section className='flex-1 min-h-0 overflow-y-auto'>
                <TradeHistoryTable />
            </section>
        </div>
    );
}