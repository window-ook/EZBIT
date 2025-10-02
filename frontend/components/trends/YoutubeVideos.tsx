'use client';

import { sanitizeTitle } from '@/utils/trends/sanitizeTitle';
import { formatKSTDate } from '@/utils/shared/date';
import { Card } from '@/components/shadcn-ui/card';
import { IYoutubeVideosResponse } from '@/types/trends/youtubeVideos';
import Video from '@/components/trends/Video';

const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
};

export default function YoutubeVideos({ videos }: { videos: IYoutubeVideosResponse['items'] }) {
    return (
        <Card
            aria-label='YOUTUBE 영상'
            className="w-full p-4 flex flex-col gap-4">
            <h2 className="sm:text-2xl text-xl font-bold text-main">YOUTUBE 영상</h2>
            <div className="grid grid-cols-12 gap-4">
                {videos.map(video => (
                    <div
                        key={`${video.id.videoId}-${video.snippet.publishTime}`}
                        className="col-span-12 sm:col-span-3">
                        <div className="space-y-2">
                            <Video
                                width={200}
                                height={150}
                                src={video.snippet.thumbnails.medium.url}
                                linkUrl={`https://youtube.com/watch?v=${video.id.videoId}`}
                            />

                            <div className="flex flex-col gap-1">
                                <span className=" text-sm leading-tight">
                                    {truncateText(sanitizeTitle(video.snippet.title), 25)}
                                </span>

                                <span className="text-main-dark text-sm">
                                    {video.snippet.channelTitle}
                                </span>

                                <time className="text-description text-xs">
                                    {formatKSTDate(video.snippet.publishTime)}
                                </time>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
}