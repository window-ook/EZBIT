import { IYoutubeVideoItem, IYoutubeVideosResponse } from "@/types/trends/video";

/** 영상 업로드 날짜 기준 정렬
 * @param data - 영상 데이터
 * @param limit - 영상 개수
 * @returns 영상 데이터
 */
export const sortVideosByUpload = (data: IYoutubeVideosResponse, limit: number = 8): IYoutubeVideoItem[] => {
    return (data.items ?? [])
        .sort((a, b) => {
            const dateA = new Date(a.snippet.publishTime).getTime();
            const dateB = new Date(b.snippet.publishTime).getTime();
            return dateB - dateA;
        })
        .slice(0, limit);
};