import { Metadata } from 'next';
import CandleChart from '@/components/exchange/CandleChart';
import MarketDetailCard from '@/components/exchange/MarketDetailCard';
import OrderbookTable from '@/components/exchange/OrderbookTable';
import OrderBox from '@/components/exchange/OrderBox';
import PrefetchedCandleChart from '@/components/exchange/PrefetchedCandleChart';
import TradeHistoryTable from '@/components/exchange/TradeHistoryTable';
import ErrorBoundaryAndSuspense from '@/components/shared/ErrorBoundaryAndSuspense';

export const metadata: Metadata = {
    title: '거래소 : EZBIT',
    description: '실시간 차트를 확인하고 코인을 주문하세요',
    keywords: ['코인', '거래소', '차트', '주문'],
};

export const dynamic = 'force-dynamic';

export default function ExchangePage() {
    return (
        <div className="flex flex-col gap-2 h-full">
            {/* 종목 상세 정보 카드 */}
            <section>
                <MarketDetailCard />
            </section>

            {/* 캔들 차트 */}
            <section>
                <ErrorBoundaryAndSuspense
                    fallbackTitle="캔들 차트를 불러올 수 없습니다."
                    fallbackDesc="잠시 후 다시 시도해주세요.">
                    <PrefetchedCandleChart params={{ type: '1min', ticker: 'KRW-BTC', count: 200 }}>
                        <CandleChart />
                    </PrefetchedCandleChart>
                </ErrorBoundaryAndSuspense>
            </section>

            {/* 오더북, 주문하기 */}
            <section className='grid grid-cols-2 gap-2'>
                <OrderbookTable />
                <OrderBox />
            </section>

            {/* 거래 내역 */}
            <section className='flex-1 min-h-0 overflow-y-auto'>
                <TradeHistoryTable />
            </section>
        </div>
    );
}