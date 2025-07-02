'use client';

import { useFetchTopics } from '@/hooks/api/useFetchTopics';
import { sanitizeTitle } from '@/utils/trends/sanitizeTitle';
import Image from 'next/image';

export default function Topics() {
    const { topics } = useFetchTopics();

    return (
        <section className="flex flex-col gap-4">
            <h2 className="text-xl sm:text-2xl font-bold text-main">토픽</h2>
            <article className="grid grid-cols-2 gap-8">
                {topics.slice(0, 12).map(article => {
                    const title = sanitizeTitle(article.title);

                    return (
                        <div key={`${article.title}-${article.url}`} className="flex pb-2">
                            <button
                                aria-label="기사 원본으로 이동하기"
                                type="button"
                                className="w-full flex gap-2 cursor-pointer hover:opacity-50 transition-all duration-200 ease-in-out"
                                onClick={() => window.open(article.url, '_blank')}
                            >
                                <Image
                                    src={article.imageUrl}
                                    alt={title}
                                    width={80}
                                    height={0}
                                    className="w-[5rem] h-full object-cover rounded-lg shrink-0"
                                    priority
                                />
                                <div className="flex flex-col gap-1 overflow-hidden">
                                    <span className="text-xs lg:text-base text-left line-clamp-2">
                                        {article.title}
                                    </span>
                                </div>
                            </button>
                        </div>
                    );
                })}
            </article>
        </section>
    );
}