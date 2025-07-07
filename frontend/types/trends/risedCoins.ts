/** 각 기간별 상승률 정보 타입 */
interface IRisedCoinsPeriods {
    oneWeek: string;
    oneMonth: string;
    threeMonths: string;
    sixMonths: string;
    oneYear: string;
}

/** rised_coins.json 전체 데이터 타입 (코인 배열) */
export interface IRisedCoin {
    name: string;
    code: string;
    periods: IRisedCoinsPeriods;
}

export type IRisedCoins = IRisedCoin[];