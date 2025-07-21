/** 영상 컴포넌트 인터페이스
 * @property {number} width - 영상 너비
 * @property {number} height - 영상 높이
 * @property {string} src - 영상 썸네일 URL
 * @property {string} linkUrl - 영상 링크 URL
 */
export interface IVideo {
    width: number;
    height: number;
    src: string;
    linkUrl: string;
}

/** 아이템 snippet thumbnails 인터페이스 */
interface IYoutubeVideoThumbnails {
    default: {
        url: string;
        width: number;
        height: number;
    };
    medium: {
        url: string;
        width: number;
        height: number;
    };
    high: {
        url: string;
        width: number;
        height: number;
    };
}

/** 아이템 snippet 인터페이스 */
interface IYoutubeVideoSnippet {
    publishedAt: string;
    channelId: string;
    title: string;
    description: string;
    thumbnails: IYoutubeVideoThumbnails;
    channelTitle: string;
    liveBroadcastContent: string;
    publishTime: string;
}

/** 유튜브 API 응답 items 내부 아이템 인터페이스 */
export interface IYoutubeVideoItem {
    snippet: IYoutubeVideoSnippet;
    id: {
        kind: string;
        videoId: string;
    };
}

/** 유튜브 API 응답 인터페이스 */
export interface IYoutubeVideosResponse {
    kind: string;
    etag: string;
    nextPageToken?: string;
    regionCode?: string;
    pageInfo?: {
        totalResults: number;
        resultsPerPage: number;
    };
    items: IYoutubeVideoItem[];
}