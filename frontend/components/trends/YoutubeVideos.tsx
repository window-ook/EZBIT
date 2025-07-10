'use client';

import { useFetchYoutubeVideos } from '@/hooks/trends/useFetchYoutubeVideos';
import { sanitizeTitle } from '@/utils/trends/sanitizeTitle';
import { formatKSTDate } from '@/utils/shared/formatKSTDate';
import Video from '@/components/trends/Video';

/** 텍스트 길이 제한 함수 */
const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
};

export default function YoutubeVideos() {
    const { videos } = useFetchYoutubeVideos();

    return (
        <section className="w-full flex flex-col gap-4">
            <h2 className="sm:text-2xl text-xl font-bold text-main">트렌드 영상</h2>
            <div className="grid grid-cols-12 gap-4">
                {videos.map(video => (
                    <div
                        key={`${video.id.videoId}-${video.snippet.publishTime}`}
                        className="col-span-12 sm:col-span-3">
                        <div className="space-y-2">
                            {/* 영상 썸네일(클릭 이동) */}
                            <Video
                                width={200}
                                height={150}
                                src={video.snippet.thumbnails.medium.url}
                                linkUrl={`https://youtube.com/watch?v=${video.id.videoId}`}
                            />

                            <div className="flex flex-col gap-1">
                                {/* 영상 제목 */}
                                <span className=" text-sm leading-tight">
                                    {truncateText(sanitizeTitle(video.snippet.title), 25)}
                                </span>

                                {/* 채널명 */}
                                <span className="text-main-dark text-sm">
                                    {video.snippet.channelTitle}
                                </span>

                                {/* 영상 업로드 날짜 */}
                                <span className="text-description text-xs">
                                    {formatKSTDate(video.snippet.publishTime)}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
