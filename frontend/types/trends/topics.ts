/** 토픽 인터페이스
 * @property {string} title 토픽 제목
 * @property {string} url 토픽 링크
 * @property {string} imageUrl 토픽 이미지 링크
 * @property {string} timestamp 토픽 생성 시간
 */
export interface ITopic {
    title: string;
    url: string;
    imageUrl: string;
    timestamp: string;
}