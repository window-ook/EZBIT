'use server';

import { IUpbitMarket } from '@/types/upbit/market';
import { ITicker } from '@/types/upbit/ticker';
import Upbit from '@/lib/api/upbit';

/** 업비트 REST API 전체 KRW 마켓 현재가 조회
 * @description 모든 KRW 종목의 현재가 정보를 한 번에 가져와 초기 데이터로 활용
 * @param markets KRW 종목 목록 (getMarkets 결과)
 * @returns 종목코드를 키로 하는 현재가 정보 객체
 */
export async function getAllTickers(markets: IUpbitMarket[]): Promise<Record<string, ITicker>> {
    if (!markets || markets.length === 0) {
        console.warn('⚠️ 마켓 목록이 비어있음');
        return {};
    }

    try {
        const upbit = new Upbit();
        const marketCodes = markets.map(market => market.market);

        console.log('📊 전체 KRW 마켓 현재가 요청: ', marketCodes.length);

        const response = await upbit.restTicker(marketCodes);

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

        console.log('✅ 전체 현재가 데이터 로드 완료:', {
            응답수: response.length,
            변환된수: Object.keys(tickers).length
        });

        return tickers;
    } catch (error) {
        console.error('❌ 전체 현재가 조회 에러:', error);
        throw new Error('전체 현재가 데이터를 가져오는데 실패했습니다.');
    }
}