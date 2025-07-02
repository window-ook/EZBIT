import { IYoutubeVideoItem, IYoutubeVideosResponse } from "@/types/trends/video";

export const sortVideosByUpload = (data: IYoutubeVideosResponse, limit: number = 8): IYoutubeVideoItem[] => {
    return (data.items ?? [])
        .sort((a, b) => {
            const dateA = new Date(a.snippet.publishTime).getTime();
            const dateB = new Date(b.snippet.publishTime).getTime();
            return dateB - dateA;
        })
        .slice(0, limit);
};