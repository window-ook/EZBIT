import { IExchangeRate } from '@/types/trends/exchangeRate';
import { memo } from 'react';
import { Card } from '@/components/shadcn-ui/card';

function ExchangeRate({ exchangeRates }: { exchangeRates: IExchangeRate[] | null }) {
    return (
        <Card
            aria-label='오늘 환율'
            className="contents-container p-4 flex flex-col gap-4">
            <h2 className="text-xl sm:text-2xl font-bold text-main">오늘 환율</h2>
            <ul className="w-full flex justify-between">
                {exchangeRates?.map(({ currency, rate }) => {
                    return (
                        <li key={currency}>
                            <dl className="flex flex-col sm:flex-row gap-1">
                                <dt className="text-xs sm:text-lg font-bold font-market-code text-main">{currency}</dt>
                                <dd className="text-xs sm:text-lg font-price">{rate.toFixed(2)}원</dd>
                            </dl>
                        </li>
                    );
                })}
            </ul>
        </Card>
    );
}

export default memo(ExchangeRate);