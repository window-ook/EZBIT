import { apiClient } from '@/lib/api/apiClient';
import { IUpbitMarkets } from '@/types/upbit/market';
import { IUpbitTicker, IUpbitTickers } from '@/types/upbit/ticker';
import { IUpbitDayCandles, IUpbitMinuteCandles, IUpbitWeekCandles, IUpbitMonthCandles } from '@/types/upbit/candle';

/**
 * 업비트 REST API 팩토리 클래스
 * @function markets 거래 가능한 전체 종목 코드 목록
 * @function ticker 해당 마켓 코드(복수 가능) 현재가 정보
 * @function candleMinutes 분봉
 * @function candleDays 일봉
 * @function candleWeeks 주봉 
 * @function candleMonths 월봉
 */
export default class Upbit {
    async markets(): Promise<IUpbitMarkets> {
        try {
            return await apiClient(`${process.env.NEXT_PUBLIC_UPBIT_API_URL}/market/all?is_details=false`, undefined, 'external');
        } catch (error) {
            console.error('전체 마켓 코드 다운로드 에러:', error);
            throw error;
        }
    }

    /**
     * @param markets 전체 종목 목록 (단일 종목 또는 여러 종목)
     */
    async ticker(markets: string | string[]): Promise<IUpbitTicker | IUpbitTickers> {
        try {
            const codesParam = Array.isArray(markets) ? markets.join(',') : markets;
            return await apiClient(`${process.env.NEXT_PUBLIC_UPBIT_API_URL}/ticker?markets=${codesParam}`, undefined, 'external');
        } catch (error) {
            console.error('현재가 다운로드 에러:', error);
            throw error;
        }
    }

    /** 
     * @param unit 분 단위 (가능한 값 : 1, 3, 5, 10, 15, 30, 60, 240)
     * @param market 마켓 코드
     * @param count 개수 (기본 1)
     * @param to 종료 시간 (ISO 8601 형식), 비워서 요청시 가장 최근 캔들
     */
    async candleMinutes(unit: number, market: string, count?: number, to?: string): Promise<IUpbitMinuteCandles> {
        try {
            let url = `${process.env.NEXT_PUBLIC_UPBIT_API_URL}/candles/minutes/${unit}?market=${market}&count=${count}`;
            if (to) url += `&to=${to}`;
            return await apiClient(url, undefined, 'external');
        } catch (error) {
            console.error('분봉 다운로드 에러:', error);
            throw error;
        }
    }

    /** 
     * @param market 마켓 코드
     * @param count 개수 (기본 1)
     * @param to 종료 시간 (ISO 8601 형식), 비워서 요청시 가장 최근 캔들
     */
    async candleDays(market: string, count?: number, to?: string): Promise<IUpbitDayCandles> {
        try {
            let url = `${process.env.NEXT_PUBLIC_UPBIT_API_URL}/candles/days?market=${market}`;
            if (count) url += `&count=${count}`;
            if (to) url += `&to=${to}`;
            return await apiClient(url, undefined, 'external');
        } catch (error) {
            console.error('일봉 다운로드 에러:', error);
            throw error;
        }
    }

    /** 
     * @param market 마켓 코드
     * @param count 개수 (기본 1)
     * @param to 종료 시간 (ISO 8601 형식), 비워서 요청시 가장 최근 캔들
     */
    async candleWeeks(market: string, count?: number, to?: string): Promise<IUpbitWeekCandles> {
        try {
            let url = `${process.env.NEXT_PUBLIC_UPBIT_API_URL}/candles/weeks?market=${market}`;
            if (count) url += `&count=${count}`;
            if (to) url += `&to=${to}`;
            return await apiClient(url, undefined, 'external');
        } catch (error) {
            console.error('주봉 다운로드 에러:', error);
            throw error;
        }
    }

    /** 
     * @param market 마켓 코드
     * @param count 개수 (기본 1)
     * @param to 종료 시간 (ISO 8601 형식), 비워서 요청시 가장 최근 캔들
     */
    async candleMonths(market: string, count?: number, to?: string): Promise<IUpbitMonthCandles> {
        try {
            let url = `${process.env.NEXT_PUBLIC_UPBIT_API_URL}/candles/months?market=${market}`;
            if (count) url += `&count=${count}`;
            if (to) url += `&to=${to}`;
            return await apiClient(url, undefined, 'external');
        } catch (error) {
            console.error('월봉 다운로드 에러:', error);
            throw error;
        }
    }
}
