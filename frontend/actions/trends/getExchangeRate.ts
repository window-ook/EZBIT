'use server';

const CURRENCIES = ['USD', 'JPY', 'CNY', 'EUR'];

interface ExchangeRateApiResponse {
    result: string;
    base_code: string;
    conversion_rates: { [key: string]: number };
    time_last_update_unix: number;
    time_last_update_utc: string;
}

interface CurrencyRate {
    currency: string;
    rate: number;
}

const calculateRate = (conversionRates: { [key: string]: number }): CurrencyRate[] => {
    const KRW = conversionRates['KRW'];

    return CURRENCIES.map(currency => ({
        currency,
        rate: KRW * (1 / conversionRates[currency]),
    }));
};

export async function getExchangeRate(): Promise<CurrencyRate[] | null> {
    try {
        const API_KEY = process.env.EXCHANGE_RATE_API_KEY;

        if (!API_KEY) {
            console.error('환율 API 키가 없습니다.');
            return null;
        }

        const response = await fetch(`https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`, { next: { revalidate: 3600 }, });

        if (!response.ok) throw new Error(`HTTP ${response.status}: API 요청 실패`);

        const data: ExchangeRateApiResponse = await response.json();

        if (data.result !== 'success') throw new Error(`API Error: ${data.result}`);

        if (!data.conversion_rates || !data.conversion_rates['KRW']) throw new Error('환율 데이터가 없습니다.');

        const missingCurrencies = CURRENCIES.filter(currency => !data.conversion_rates[currency]);

        if (missingCurrencies.length > 0) throw new Error(`누락된 통화: ${missingCurrencies.join(', ')}`);

        return calculateRate(data.conversion_rates);
    } catch (error) {
        console.error('환율 데이터 조회 중 에러:', error);
        if (error instanceof Error) {
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);
        }

        return null;
    }
}