import CandleChart from '@/components/exchange/CandleChart';
import MarketDetailCard from '@/components/exchange/MarketDetailCard';
import OrderbookTable from '@/components/exchange/OrderbookTable';
import PrefetchedCandleChart from '@/components/exchange/PrefetchedCandleChart';
import ErrorBoundaryAndSuspense from '@/components/shared/ErrorBoundaryAndSuspense';

export default function ExchangePage() {
    return (
        <div className="grid grid-cols-2 grid-rows-3 gap-2">
            {/* 종목 상세 정보 카드 */}
            <section className="col-span-2">
                <MarketDetailCard />
            </section>

            {/* 캔들 차트 */}
            <section className="col-span-2 row-span-2">
                <ErrorBoundaryAndSuspense
                    fallbackTitle="캔들 차트를 불러올 수 없습니다."
                    fallbackDesc="잠시 후 다시 시도해주세요.">
                    <PrefetchedCandleChart params={{ type: '1min', ticker: 'KRW-BTC', count: 200 }}>
                        <CandleChart />
                    </PrefetchedCandleChart>
                </ErrorBoundaryAndSuspense>
            </section>

            {/* 오더북, 주문하기 */}
            <section className="col-span-2 grid grid-cols-2">
                <OrderbookTable />
                <div>주문하기 박스</div>
            </section>

            {/* 거래 내역 */}
            <section className="col-span-2">
                <div>거래내역</div>
            </section>
        </div>

    );
}