import { Card } from '@/components/shadcn-ui/card';
import { ITopCoins } from '@/types/upbit/topCoins';
import { formatKSTDate } from '@/utils/shared/date';

const TODAY = new Date().toISOString();

export default function TodayTopTradingVolumeCoins({ coins }: { coins: ITopCoins[] }) {
    const currentDate = formatKSTDate(TODAY);

    return (
        <Card
            aria-label='24시간 거래대금 TOP 5'
            className="w-full h-[315px] p-4 flex-1 flex flex-col gap-6">
            <div className='flex justify-between items-end'>
                <h2 className="pl-1 text-xl sm:text-2xl font-bold text-main">24시간 거래대금 TOP 5</h2>
                <time className="text-description">{currentDate}</time>
            </div>
            <div className="w-full flex flex-col gap-6" data-testid="top-trading-volume-coins-list">
                {coins.map(coin => (
                    <div
                        key={`${coin.rank}-${coin.code}`}
                        data-testid={`coin-item-${coin.code}`}
                        aria-label={`${coin.name} ${coin.code} ${coin.rate >= 0 ? '+' : ''}${coin.rate.toFixed(2)}%`}
                        className="grid grid-cols-12 gap-4 px-2 items-center"
                    >
                        <span className="col-span-4 text-sm sm:text-base font-market-korean">{coin.name}</span>
                        <span className="col-span-4 text-sm sm:text-base font-market-code text-description">
                            {coin.code}
                        </span>
                        <span className={`col-span-4 text-right text-sm sm:text-base font-percentage ${coin.rate >= 0 ? 'text-positive' : 'text-negative'}`}>
                            {coin.rate >= 0 ? '+' : ''}{coin.rate}%
                        </span>
                    </div>
                ))}
            </div>
        </Card>
    );
}