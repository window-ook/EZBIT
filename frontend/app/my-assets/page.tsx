import { HoldingsTable } from '@/components/my-assets/HoldingsTable';
import { HoldingsSummary } from '@/components/my-assets/HoldingSummary';
import { InvestmentChart } from '@/components/my-assets/InvestmentChart';
import { InvestmentStatement } from '@/components/my-assets/InvestmentStatement';
import { SixMonthsFlowChart } from '@/components/my-assets/SixMonthsFlowChart';
import HighestEarning from '@/components/my-assets/HighestEarning';

const HOLDING_KRW = [{ title: '총 매수', amount: '1,000,000' }, { title: '총 평가', amount: '12,000,102' }];
const TOTAL_ASSETS = [{ title: '평가손익', amount: '3,650,000' }, { title: '수익률', amount: '10%' }];

export default function MyAssetsPage() {
    return (
        <div className="grid grid-cols-2 grid-rows-2 gap-2 h-full">
            {/* 보유 현금, 총 보유 자산, 최고 수익률 코인, 투자손익표 */}
            <section className="grid grid-cols-2 grid-rows-2 gap-2">
                <HoldingsSummary
                    title="보유 KRW"
                    subTitle="주문가능 KRW"
                    amount="2,500,000"
                    contents={HOLDING_KRW}
                />
                <HoldingsSummary
                    title="총 보유자산"
                    subTitle="보유 KRW + 총 매수"
                    amount="3,650,000"
                    contents={TOTAL_ASSETS}
                />
                <HighestEarning />
                <InvestmentStatement />
            </section>

            {/* 차트 */}
            <section className="col-start-2 grid grid-rows-2 gap-2">
                <InvestmentChart />
                <SixMonthsFlowChart />
            </section>

            {/* 테이블 */}
            <section className="col-span-2">
                <HoldingsTable />
            </section>
        </div>
    );
}
