import { ITicker } from '@/types/upbit/ticker';
import { ITopCoins } from '@/types/upbit/topCoins';

export const calculateTopRisedCoins = (
    tickers: Record<string, ITicker>,
    krwNames: Record<string, string>
): ITopCoins[] => {
    return Object.values(tickers)
        .filter(ticker => ticker.market.startsWith('KRW-'))
        .sort((a, b) => b.signed_change_rate - a.signed_change_rate)
        .slice(0, 10)
        .map((ticker, index) => ({
            rank: index + 1,
            name: krwNames[ticker.market] || ticker.market.replace('KRW-', ''),
            code: ticker.market.replace('KRW-', '') + '/KRW',
            rate: parseFloat((ticker.signed_change_rate * 100).toFixed(2))
        }));
};

export const calculateTradingVolumeTopCoins = (
    tickers: Record<string, ITicker>,
    krwNames: Record<string, string>
): ITopCoins[] => {
    return Object.values(tickers)
        .filter(ticker => ticker.market.startsWith('KRW-'))
        .sort((a, b) => b.acc_trade_price_24h - a.acc_trade_price_24h)
        .slice(0, 5)
        .map((ticker, index) => ({
            rank: index + 1,
            name: krwNames[ticker.market] || ticker.market.replace('KRW-', ''),
            code: ticker.market.replace('KRW-', '') + '/KRW',
            rate: parseFloat((ticker.signed_change_rate * 100).toFixed(2))
        }));
};
