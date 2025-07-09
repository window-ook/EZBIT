/** 캔들 조회 파라미터 인터페이스
 * @property {string} type 캔들 종류
 * @property {string} ticker 종목
 * @property {number} count 캔들 개수
 * @property {number} unit 캔들 단위 (1분, 5분, 1일, 1주, 1개월)
 * @property {string} to 캔들 종료 시간
*/
export interface ICandlesParams {
    type: string;
    ticker: string;
    count: number;
    unit?: number;
    to?: string;
}