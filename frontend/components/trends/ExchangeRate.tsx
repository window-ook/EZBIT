import { IExchangeRate } from '@/types/trends/exchangeRate';
import { memo } from 'react';
import { Card } from '@/components/shadcn-ui/card';

function ExchangeRate({ exchangeRates }: { exchangeRates: IExchangeRate[] | null }) {
    return (
        <Card className="contents-container p-4 flex flex-col gap-4">
            <header>
                <h2 className="text-xl sm:text-2xl font-bold text-main">오늘 환율</h2>
            </header>
            <div className="flex items-center">
                <ul className="w-full flex justify-between">
                    {exchangeRates?.map(({ currency, rate }) => {
                        return (
                            <li key={currency}>
                                <div className="flex flex-col sm:flex-row gap-1">
                                    <span className="text-xs sm:text-lg font-bold text-blue-500">{currency}</span>
                                    <span className="text-xs sm:text-lg">{rate.toFixed(2)}원</span>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </Card>
    );
}

export default memo(ExchangeRate);
