/** 업비트 종목 정보
 * @property {string} market 종목 코드
 * @property {string} korean_name 종목 한글명
 * @property {string} english_name 종목 영문명
 */
export interface IUpbitMarket {
    market: string;
    korean_name: string;
    english_name: string;
}

/** 업비트 종목 목록 조회 Response
 * @description REST API
 * @see https://docs.upbit.com/kr/reference/%EB%A7%88%EC%BC%93-%EC%BD%94%EB%93%9C-%EC%A1%B0%ED%9A%8C
 */
export type IUpbitMarkets = IUpbitMarket[];