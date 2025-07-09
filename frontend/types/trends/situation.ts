/** 시황 데이터 인터페이스
 * @property {string} title 시황 제목
 * @property {string} url 시황 링크
 * @property {string} imageUrl 시황 이미지 링크
 * @property {string} timestamp 시황 생성 시간
 */
export interface ISituation {
    title: string;
    url: string;
    imageUrl: string;
    timestamp: string;
}

export type ISituations = ISituation[];