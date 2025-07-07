/** 토픽 */
export interface ITopic {
    title: string;
    url: string;
    imageUrl: string;
    timestamp: string;
}

/** 토픽 데이터 배열 */
export type ITopics = ITopic[];