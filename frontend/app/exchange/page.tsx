import { Metadata } from 'next';
import { getUserData } from '@/actions/supabase/getUserData';
import CandleChart from '@/components/exchange/CandleChart';
import MarketDetailCard from '@/components/exchange/MarketDetailCard';
import OrderbookTable from '@/components/exchange/OrderbookTable';
import OrderBox from '@/components/exchange/OrderBox';
import TradeHistoryTable from '@/components/exchange/TradeHistoryTable';

export const metadata: Metadata = {
    title: '거래소 : EZBIT',
    description: '실시간 차트를 확인하고 코인을 주문하세요',
    keywords: ['코인', '거래소', '차트', '주문'],
};

export const dynamic = 'force-dynamic';

export default async function ExchangePage() {
    let userData = null; // 비로그인 오류 방지를 위해 기본값 null 설정

    try {
        userData = await getUserData();
    } catch {
        userData = null;
    }

    return (
        <div className="flex flex-col gap-2 h-full">
            {/* 종목 상세 정보 카드 */}
            <MarketDetailCard />

            {/* 캔들 차트 */}
            <CandleChart />

            {/* 오더북, 주문하기 */}
            <section className='grid grid-cols-2 gap-2'>
                <OrderbookTable />
                <OrderBox user={userData} />
            </section>

            {/* 거래 내역 */}
            <section className='flex-1 min-h-0 overflow-y-auto'>
                <TradeHistoryTable />
            </section>
        </div>
    );
}