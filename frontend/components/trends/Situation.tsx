'use client';

import { useEffect, useState } from 'react';
import { useSituationArticles } from '@/hooks/trends/useSituationArticles';
import { ISituationArticles } from '@/types/trends/situationArticles';
import { Card } from '@/components/shadcn-ui/card';

const formatDate = (pubDate: string) => {
    const date = new Date(pubDate);
    return `${date.getMonth() + 1}월 ${date.getDate()}일 ${date.getHours()}:${date.getMinutes()} `;
};

export default function Situation({ today }: { today: string }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentNews, setCurrentNews] = useState<ISituationArticles | null>(null);

    const { situationArticles } = useSituationArticles();

    const currentDate = formatDate(today);

    useEffect(() => {
        if (!situationArticles) return;

        const interval = setInterval(() => setCurrentIndex(prevIndex => (prevIndex + 1) % situationArticles!.length), 5000);
        return () => clearInterval(interval);
    }, [situationArticles]);

    useEffect(() => {
        setCurrentNews(situationArticles?.[currentIndex] || null);
    }, [situationArticles, currentIndex]);

    return (
        <Card
            aria-label='시황 뉴스'
            className="p-4 flex flex-col gap-4">
            <h2 className="text-main text-xl sm:text-2xl font-bold">시황</h2>
            <time className="text-description">{currentDate} 기준</time>
            <article className="relative w-full h-10 p-8 rounded-lg flex items-center">
                <button
                    key={currentIndex}
                    type="button"
                    aria-label="기사 링크로 이동하기 버튼"
                    onClick={() => window.open(currentNews?.url, '_blank')}
                    className="absolute overflow-hidden whitespace-nowrap text-ellipsis inset-0 p-2 flex items-center hover-button"
                >
                    <span className="font-semibold text-sm sm:text-lg">
                        {currentNews?.title}
                    </span>
                </button>
            </article>
        </Card>
    );
}


