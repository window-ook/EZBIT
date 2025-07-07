/** 시황 데이터 */
export interface ISituation {
    title: string;
    url: string;
    imageUrl: string;
    timestamp: string;
}

/** 시황 데이터 배열 */
export type ISituations = ISituation[];