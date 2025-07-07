/** 시세 캔들 조회 파라미터  */
export interface ICandlesParams {
    type: string;
    ticker: string;
    count: number;
    unit?: number;
    to?: string;
}