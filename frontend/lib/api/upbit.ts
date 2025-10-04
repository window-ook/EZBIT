import { apiClient } from '@/lib/api/apiClient';
import { EXTERNAL_PATHS } from '@/lib/api/paths';
import { IUpbitMarket } from '@/types/upbit/market';
import { IUpbitRestTicker, IUpbitTicker } from '@/types/upbit/ticker';
import { IUpbitMinuteCandle, IUpbitDayCandle, IUpbitWeekCandle, IUpbitMonthCandle } from '@/types/upbit/candle';
import { RequestInit } from 'next/dist/server/web/spec-extension/request';
import { CONSOLE_ERROR } from '@/constants/messages';

interface IFetchOptions extends RequestInit {
    next?: { revalidate?: number },
    cache?: 'force-cache' | 'no-store';
}

/**
 * 업비트 REST API 팩토리
 * @function markets 거래 가능한 전체 종목 코드 목록
 * @function ticker 해당 마켓 코드(복수 가능) 현재가 정보 (WebSocket)
 * @function restTicker 해당 마켓 코드(복수 가능) 현재가 정보 (REST API)
 * @function candleMinutes 분봉
 * @function candleDays 일봉
 * @function candleWeeks 주봉 
 * @function candleMonths 월봉
 */
export default class Upbit {
    async markets(options?: IFetchOptions): Promise<IUpbitMarket[]> {
        try {
            return await apiClient(EXTERNAL_PATHS.UPBIT.MARKETS(EXTERNAL_PATHS.UPBIT.BASE_URL), options, 'external');
        } catch (error) {
            console.error(CONSOLE_ERROR.UPBIT_MARKETS, error);
            throw error;
        }
    }

    /**
     * 현재가 정보 요청을 위한 공통 메서드
     * @param markets 전체 종목 목록 (단일 종목 또는 여러 종목)
     * @private
     */
    private async fetchTickerData<T>(markets: string | string[]): Promise<T> {
        try {
            const codesParam = Array.isArray(markets) ? markets.join(',') : markets;
            return await apiClient(EXTERNAL_PATHS.UPBIT.TICKER(EXTERNAL_PATHS.UPBIT.BASE_URL, codesParam), undefined, 'external');
        } catch (error) {
            console.error(CONSOLE_ERROR.UPBIT_TICKER, error);
            throw error;
        }
    }

    /**
     * @param markets 전체 종목 목록 (단일 종목 또는 여러 종목)
     */
    async ticker(markets: string | string[]): Promise<IUpbitTicker | IUpbitTicker[]> {
        return await this.fetchTickerData<IUpbitTicker | IUpbitTicker[]>(markets);
    }

    /**
    * @param markets 전체 종목 목록 (단일 종목 또는 여러 종목)
    */
    async restTicker(markets: string | string[]): Promise<IUpbitRestTicker[]> {
        return await this.fetchTickerData<IUpbitRestTicker[]>(markets);
    }

    /** 
     * @param unit 분 단위 (가능한 값 : 1, 3, 5, 10, 15, 30, 60, 240)
     * @param market 마켓 코드
     * @param count 개수 (기본 1)
     * @param to 종료 시간 (ISO 8601 형식), 비워서 요청시 가장 최근 캔들
     */
    async candleMinutes(unit: number, market: string, count?: number, to?: string): Promise<IUpbitMinuteCandle[]> {
        try {
            const url = EXTERNAL_PATHS.UPBIT.CANDLES.MINUTES(EXTERNAL_PATHS.UPBIT.BASE_URL, unit, market, count, to);
            return await apiClient(url, undefined, 'external');
        } catch (error) {
            console.error(CONSOLE_ERROR.UPBIT_CANDLE_MINUTES, error);
            throw error;
        }
    }

    /** 
     * @param market 마켓 코드
     * @param count 개수 (기본 1)
     * @param to 종료 시간 (ISO 8601 형식), 비워서 요청시 가장 최근 캔들
     */
    async candleDays(market: string, count?: number, to?: string): Promise<IUpbitDayCandle[]> {
        try {
            const url = EXTERNAL_PATHS.UPBIT.CANDLES.DAYS(EXTERNAL_PATHS.UPBIT.BASE_URL, market, count, to);
            return await apiClient(url, undefined, 'external');
        } catch (error) {
            console.error(CONSOLE_ERROR.UPBIT_CANDLE_DAYS, error);
            throw error;
        }
    }

    /** 
     * @param market 마켓 코드
     * @param count 개수 (기본 1)
     * @param to 종료 시간 (ISO 8601 형식), 비워서 요청시 가장 최근 캔들
     */
    async candleWeeks(market: string, count?: number, to?: string): Promise<IUpbitWeekCandle[]> {
        try {
            const url = EXTERNAL_PATHS.UPBIT.CANDLES.WEEKS(EXTERNAL_PATHS.UPBIT.BASE_URL, market, count, to);
            return await apiClient(url, undefined, 'external');
        } catch (error) {
            console.error(CONSOLE_ERROR.UPBIT_CANDLE_WEEKS, error);
            throw error;
        }
    }

    /** 
     * @param market 마켓 코드
     * @param count 개수 (기본 1)
     * @param to 종료 시간 (ISO 8601 형식), 비워서 요청시 가장 최근 캔들
    */
    async candleMonths(market: string, count?: number, to?: string): Promise<IUpbitMonthCandle[]> {
        try {
            const url = EXTERNAL_PATHS.UPBIT.CANDLES.MONTHS(EXTERNAL_PATHS.UPBIT.BASE_URL, market, count, to);
            return await apiClient(url, undefined, 'external');
        } catch (error) {
            console.error(CONSOLE_ERROR.UPBIT_CANDLE_MONTHS, error);
            throw error;
        }
    }
}