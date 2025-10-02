import { apiClient } from '@/lib/api/apiClient';
import { EXTERNAL_PATHS } from '@/lib/api/paths';
import { IUpbitMarket } from '@/types/upbit/market';
import { ITicker, IUpbitRestTicker } from '@/types/upbit/ticker';

export async function fetchTickers(markets: IUpbitMarket[]): Promise<Record<string, ITicker>> {
  if (!markets || markets.length === 0) return {};

  const marketCodes = markets.map(market => market.market);
  const codesParam = marketCodes.join(',');

  const response = await apiClient<IUpbitRestTicker[]>(
    EXTERNAL_PATHS.UPBIT.TICKER(EXTERNAL_PATHS.UPBIT.BASE_URL, codesParam),
    { cache: 'no-store' },
    'external'
  );

  const tickers: Record<string, ITicker> = response.reduce((acc, restTicker) => {
    if (restTicker?.market) {
      acc[restTicker.market] = {
        market: restTicker.market,
        trade_price: restTicker.trade_price || 0,
        prev_closing_price: restTicker.prev_closing_price || 0,
        signed_change_rate: restTicker.signed_change_rate || 0,
        signed_change_price: restTicker.signed_change_price || 0,
        acc_trade_price_24h: restTicker.acc_trade_price_24h || 0,
        acc_trade_volume_24h: restTicker.acc_trade_volume_24h || 0,
        high_price: restTicker.high_price || 0,
        low_price: restTicker.low_price || 0,
        lowest_52_week_price: restTicker.lowest_52_week_price || 0,
        highest_52_week_price: restTicker.highest_52_week_price || 0,
      };
    }
    return acc;
  }, {} as Record<string, ITicker>);

  return tickers;
}