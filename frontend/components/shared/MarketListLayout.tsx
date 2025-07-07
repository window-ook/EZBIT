'use client';

import React from "react";
import MarketList from '@/components/shared/MarketList';

export default function MarketListLayout({ children }: { children: React.ReactNode }) {
    return (
        <main className="contents-container py-6">
            <div className="grid grid-cols-3 grid-rows-4 gap-2 h-full sm:h-[80rem]">
                {/* 1열 4행 전체 - 마켓 리스트 */}
                <aside className="col-span-1 row-span-4">
                    <MarketList />
                </aside>

                {/* 2,3열 4행 전체 children */}
                <section className="col-span-2 col-start-2 row-span-4">
                    {children}
                </section>
            </div>
        </main>
    );
} 