import { IYoutubeVideoItem, IYoutubeVideosResponse } from "@/types/trends/video";

/** 영상 업로드 날짜 기준 정렬 헬퍼 함수
 * @param data - 영상 데이터
 * @param limit - 영상 개수
 * @returns 영상 데이터
 */
export const sortByUploadDate = (data: IYoutubeVideosResponse, limit: number = 8): IYoutubeVideoItem[] => {
    return (data.items ?? [])
        .sort((a, b) => {
            const dateA = new Date(a.snippet.publishTime).getTime();
            const dateB = new Date(b.snippet.publishTime).getTime();
            return dateB - dateA;
        })
        .slice(0, limit);
};

/** 날짜 포맷팅 함수 (KST 고정)
 * @param {string} publishTime 날짜 문자열
 * @returns {string} 포맷팅된 날짜 문자열
 */
export const formatKSTDate = (publishTime: string): string => {
    const date = new Date(publishTime);
    const kst = new Date(date.getTime() + 9 * 60 * 60 * 1000);
    const year = kst.getUTCFullYear();
    const month = String(kst.getUTCMonth() + 1).padStart(2, '0');
    const day = String(kst.getUTCDate()).padStart(2, '0');
    const hours = String(kst.getUTCHours()).padStart(2, '0');
    const minutes = String(kst.getUTCMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
};