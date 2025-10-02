import { Metadata } from 'next';
import CandleChart from '@/components/exchange/CandleChart';
import MarketDetailCard from '@/components/exchange/MarketDetailCard';
import OrderForm from '@/components/exchange/OrderForm';
import TradeHistoryTable from '@/components/exchange/TradeHistoryTable';
import OrderbookTable from '@/components/exchange/OrderbookTable';
import ExchangeStatusManager from '@/components/exchange/ExchangeStatusManager';

export const metadata: Metadata = {
    title: '거래소 : EZBIT',
    description: '실시간 차트를 확인하고 코인을 주문하세요',
    keywords: ['EZBIT 거래소', 'EZBIT 차트', 'EZBIT 주문'],
};

export default async function ExchangePage() {
    return (
        <main className="h-full flex flex-col gap-2">
            <ExchangeStatusManager />
            <MarketDetailCard />
            <CandleChart />
            <section className='flex flex-col md:flex-row justify-center gap-2'>
                <OrderbookTable />
                <OrderForm />
            </section>
            <section className='flex-1 overflow-y-auto flex justify-center'>
                <TradeHistoryTable />
            </section>
        </main>
    );
}