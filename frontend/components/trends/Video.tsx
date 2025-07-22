'use client';

import { useEffect, useState } from 'react';
import { IVideo } from '@/types/trends/youtubeVideos';
import Image from 'next/image';

const FALLBACK_SRC = 'https://res.cloudinary.com/dbvzbdffi/image/upload/v1751435269/fallback_src_hf4lnv.avif';

export default function Video({ width, height, src, linkUrl }: IVideo) {
    const [imgSrc, setImgSrc] = useState(src);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const handleClick = () => window.open(linkUrl);
    const handleError = () => setImgSrc(FALLBACK_SRC);

    return (
        <button
            type="button"
            aria-label="영상 원본으로 이동하기 버튼"
            onClick={handleClick}
            className="relative w-full h-auto overflow-hidden rounded-sm cursor-pointer hover:opacity-70 transition-opacity duration-300 ease"
        >
            <Image
                alt="영상 썸네일"
                src={isClient ? imgSrc : src}
                width={width}
                height={height}
                priority
                onError={handleError}
                className='w-full h-full obeject-cover'
            />
        </button>
    );
}
