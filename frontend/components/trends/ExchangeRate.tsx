import { IExchangeRate } from '@/types/trends/exchangeRate';
import { memo } from 'react';

function ExchangeRate({ exchangeRates }: { exchangeRates: IExchangeRate[] }) {
    return (
        <section className="contents-container flex flex-col gap-4">
            <header>
                <h2 className="text-xl sm:text-2xl font-bold text-main">오늘 환율</h2>
            </header>
            <div className="flex items-center">
                <ul className="w-full flex justify-between">
                    {exchangeRates.map(({ currency, rate }) => {
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
        </section>
    );
}

export default memo(ExchangeRate);
