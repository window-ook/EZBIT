import { IExchangeRate } from '@/types/trends/exchangeRate';
import { memo } from 'react';
import { Card } from '@/components/shadcn-ui/card';

const labels: Record<string, string> = {
    'USD': '미국 $',
    'EUR': '유로 €',
    'JPY(100)': '일본 ¥',
    'CNH': '중국 위안화'
};

function ExchangeRate({ exchangeRates, searchDate }: { exchangeRates: IExchangeRate[] | null; searchDate: string | null }) {
    const koreanDate = `${searchDate?.slice(4, 6)}월 ${searchDate?.slice(6, 8)}일 기준`;

    return (
        <Card
            aria-label='오늘 환율'
            className="contents-container p-4 flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl sm:text-2xl font-bold text-main">오늘 환율</h2>
                {searchDate && <p className="text-xs sm:text-sm text-gray-500">{koreanDate}</p>}
            </div>
            <ul className="w-full flex justify-between">
                {exchangeRates?.map(({ currency, rate }) => {
                    return (
                        <li key={currency}>
                            <dl className="flex flex-col sm:flex-row gap-1">
                                <dt className="text-xs sm:text-lg font-bold font-market-code text-main">{labels[currency]}</dt>
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