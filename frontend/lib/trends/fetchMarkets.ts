import { IUpbitMarket } from '@/types/upbit/market';
import Upbit from '@/lib/api/upbit';

/** 업비트 KRW 마켓의 모든 종목 페칭 함수 */
export async function fetchMarkets(): Promise<IUpbitMarket[]> {
  const upbit = new Upbit();
  const allMarkets = await upbit.markets({ next: { revalidate: 3600 } });
  const krwMarkets = allMarkets.filter((market) => market.market.startsWith('KRW-'));
  return krwMarkets;
};