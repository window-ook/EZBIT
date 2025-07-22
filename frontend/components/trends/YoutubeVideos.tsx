'use client';

import { useYoutubeVideos } from '@/hooks/trends/useYoutubeVideos';
import { sanitizeTitle } from '@/utils/trends/sanitizeTitle';
import { formatKSTDate } from '@/utils/shared/date';
import { Card } from '@/components/shadcn-ui/card';
import Video from '@/components/trends/Video';

/** 텍스트 길이 제한 함수 */
const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
};

export default function YoutubeVideos() {
    const { videos } = useYoutubeVideos();

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
                            {/* 영상 썸네일 */}
                            <Video
                                width={200}
                                height={150}
                                src={video.snippet.thumbnails.medium.url}
                                linkUrl={`https://youtube.com/watch?v=${video.id.videoId}`}
                            />

                            <div className="flex flex-col gap-1">
                                {/* 영상 제목 */}
                                <dl className=" text-sm leading-tight">
                                    {truncateText(sanitizeTitle(video.snippet.title), 25)}
                                </dl>

                                {/* 채널명 */}
                                <dl className="text-main-dark text-sm">
                                    {video.snippet.channelTitle}
                                </dl>

                                {/* 영상 업로드 날짜 */}
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
