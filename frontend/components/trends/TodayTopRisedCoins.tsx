import { Card } from '@/components/shadcn-ui/card';
import { ITopCoins } from '@/types/upbit/topCoins';

export default function TodayTopRisedCoins({ coins, currentDate }: { coins: ITopCoins[]; currentDate: string; }) {
    return (
        <Card
            aria-label='실시간 상승률 TOP 10'
            className="w-full h-[580px] p-4 flex-1 flex flex-col gap-6"
        >
            <div className='flex justify-between items-end'>
                <h2 className="pl-1 text-xl sm:text-2xl font-bold text-main">실시간 상승률 TOP 10</h2>
                <time className="text-description text-xs">{currentDate} 기준</time>
            </div>
            <div className="w-full flex flex-col gap-6" data-testid="top-rised-coins-list">
                {coins.map(coin => (
                    <div
                        key={`${coin.rank}-${coin.code}`}
                        data-testid={`coin-item-${coin.code}`}
                        aria-label={`${coin.name} ${coin.code} ${coin.rate >= 0 ? '+' : ''}${coin.rate.toFixed(2)}%`}
                        className="grid grid-cols-12 px-2 items-center"
                    >
                        <span className="col-span-4 text-sm sm:text-base font-market-korean">{coin.name}</span>
                        <span className="col-span-4 text-sm sm:text-base font-market-code text-description">
                            {coin.code}
                        </span>
                        <span className={`col-span-4 text-right text-sm sm:text-base font-percentage ${coin.rate >= 0 ? 'text-positive' : 'text-negative'}`}>
                            {coin.rate >= 0 ? '+' : ''}{coin.rate.toFixed(2)}%
                        </span>
                    </div>
                ))}
            </div>
        </Card>
    );
}