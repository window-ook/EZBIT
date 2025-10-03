'use client';

import { useEffect, useState } from 'react';
import { ISituationArticles } from '@/types/trends/situationArticles';
import { Card } from '@/components/shadcn-ui/card';

export default function SituationArticles({ articles }: { articles: ISituationArticles[] }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentNews, setCurrentNews] = useState<ISituationArticles | null>(null);

    useEffect(() => {
        if (!articles || articles.length === 0) return;
        const interval = setInterval(() => setCurrentIndex(prevIndex => (prevIndex + 1) % articles.length), 5000);
        return () => clearInterval(interval);
    }, [articles]);

    useEffect(() => {
        setCurrentNews(articles?.[currentIndex] || null);
    }, [articles, currentIndex]);

    return (
        <Card
            aria-label='시황'
            className="p-4 flex flex-col gap-4">
            <div className='flex items-end gap-4'>
                <h2 className="text-main text-xl sm:text-2xl font-bold">시황</h2>
                <p className='text-description'>POWERED BY TOKENPOST</p>
            </div>
            <article className="relative w-full h-10 p-8 rounded-lg flex items-center">
                <button
                    key={currentIndex}
                    type="button"
                    aria-label="기사 링크로 이동하기 버튼"
                    onClick={() => window.open(currentNews?.url, '_blank')}
                    className="absolute overflow-hidden sm:whitespace-nowrap text-ellipsis inset-0 p-2 flex items-center hover-button"
                >
                    <span className="font-semibold text-base sm:text-lg">
                        {currentNews?.title}
                    </span>
                </button>
            </article>
        </Card>
    );
}