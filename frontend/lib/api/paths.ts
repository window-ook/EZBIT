const EXTERNAL_PATHS = {
    TRENDS: {
        RISED_COINS: '/mock/rised_coins.json',
        SITUATION: '/mock/situation.json',
        TOPICS: '/mock/topics.json',
        YOUTUBE_VIDEOS: '/mock/youtube_videos.json',
    }

} as const;

const INTERNAL_PATHS = {
    TRENDS: {
        SITUATION: '/api/trends/situation',
        TOPICS: '/api/trends/topics',
        YOUTUBE_VIDEOS: '/api/trends/youtube-videos',
        RISED_COINS: '/api/trends/rised-coins',
    },
} as const;

export { INTERNAL_PATHS, EXTERNAL_PATHS };