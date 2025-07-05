'use client';

import { useEffect, useState } from 'react';
import { useFetchSituation } from '@/hooks/api/useFetchSituation';
import { ISituationItem } from '@/types/trends/situation';

const formatDate = (pubDate: string) => {
    const date = new Date(pubDate);
    return `${date.getMonth() + 1}월 ${date.getDate()}일 ${date.getHours()}:${date.getMinutes()} `;
};

export default function Situation() {
    const [currentDate, setCurrentDate] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentNews, setCurrentNews] = useState<ISituationItem | null>(null);

    const { situation } = useFetchSituation();

    useEffect(() => {
        if (!situation) return;

        const interval = setInterval(() => setCurrentIndex(prevIndex => (prevIndex + 1) % situation.length), 5000);
        return () => clearInterval(interval);
    }, [situation]);

    useEffect(() => {
        setCurrentNews(situation?.[currentIndex]);
        setCurrentDate(formatDate(new Date().toISOString()));
    }, [situation, currentIndex]);

    return (
        <section className="flex flex-col gap-4">
            <header className="flex items-end gap-2">
                <h2 className="text-main text-xl sm:text-2xl font-bold">시황</h2>
                <span className="text-description">{currentDate}</span>
            </header>
            <article className="relative w-full h-10 p-8 rounded-lg flex items-center">
                <button
                    key={currentIndex}
                    type="button"
                    aria-label="기사 링크로 이동하기"
                    onClick={() => window.open(currentNews?.url, '_blank')}
                    className="absolute overflow-hidden whitespace-nowrap text-ellipsis inset-0 p-2 flex items-center hover-button"
                >
                    <span className="font-semibold text-sm sm:text-lg">
                        {currentNews?.title}
                    </span>
                </button>
            </article>
        </section>
    );
}


