'use client';

import React from "react";
import MarketList from '@/components/shared/MarketList';

export default function MarketListLayout({ children }: { children: React.ReactNode }) {
    return (
        <main className="contents-container py-4 md:py-6 px-4 lg:px-0">
            <div className="h-full md:h-[80rem] grid grid-cols-1 md:grid-cols-3 grid-rows-4 md:gap-2">
                {/* 1열 4행 전체 - 마켓 리스트 */}
                <aside className="row-span-4 pb-2 md:pb-0">
                    <MarketList />
                </aside>

                {/* 2,3열 4행 전체 children */}
                <section className="col-start-1 md:col-start-2 col-span-2 row-span-4">
                    {children}
                </section>
            </div>
        </main>
    );
} 