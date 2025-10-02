import { apiClient } from '@/lib/api/apiClient';
import { EXTERNAL_PATHS } from '@/lib/api/paths';
import { IUpbitMarket } from '@/types/upbit/market';

export async function fetchMarkets(): Promise<IUpbitMarket[]> {
  const allMarkets = await apiClient<IUpbitMarket[]>(EXTERNAL_PATHS.UPBIT.MARKETS(EXTERNAL_PATHS.UPBIT.BASE_URL), { next: { revalidate: 3600 } }, 'external');
  const krwMarkets = allMarkets.filter((market) => market.market.startsWith('KRW-'));
  return krwMarkets;
};