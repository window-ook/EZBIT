/** 각 기간별 상승률 정보 인터페이스
 * @property {string} oneWeek 1주일 상승률
 * @property {string} oneMonth 1개월 상승률
 * @property {string} threeMonths 3개월 상승률
 * @property {string} sixMonths 6개월 상승률
 * @property {string} oneYear 1년 상승률
 */
interface IRisedCoinsPeriods {
    oneWeek: string;
    oneMonth: string;
    threeMonths: string;
    sixMonths: string;
    oneYear: string;
}

/** rised_coins.json 전체 데이터 인터페이스
 * @property {string} name 코인 이름
 * @property {string} code 코인 코드
 * @property {IRisedCoinsPeriods} periods 각 기간별 상승률
 */
export interface IRisedCoin {
    name: string;
    code: string;
    periods: IRisedCoinsPeriods;
}

export type IRisedCoins = IRisedCoin[];