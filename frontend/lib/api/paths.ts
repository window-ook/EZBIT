/** 외부 API 경로 정의
 * @property {string} TRENDS.RISED_COINS 기간별 상승률 TOP 데이터
 * @property {string} TRENDS.SITUATION 시황 데이터
 * @property {string} TRENDS.TOPICS 토픽 데이터
 * @property {string} TRENDS.YOUTUBE_VIDEOS 영상 데이터
 */
export const EXTERNAL_PATHS = {
    TRENDS: {
        RISED_COINS: '/mock/rised_coins.json',
        SITUATION: '/mock/situation.json',
        TOPICS: '/mock/topics.json',
        YOUTUBE_VIDEOS: '/mock/youtube_videos.json',
    }

} as const;