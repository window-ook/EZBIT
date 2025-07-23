'use client';

import React from "react";
import MarketList from '@/components/shared/MarketList';

export default function MarketListLayout({ children }: { children: React.ReactNode }) {
    return (
        <main className="contents-container py-4 md:py-6 px-4 lg:px-0">
            {/* 모바일 레이아웃 (md 미만) */}
            <div className="md:hidden h-full flex flex-col gap-2">
                <aside className="h-80 flex-shrink-0 w-full">
                    <MarketList />
                </aside>

                <section className="flex-1 min-h-0 w-full">
                    {children}
                </section>
            </div>

            {/* 데스크톱 레이아웃 (md 이상) */}
            <div className="hidden md:grid grid-cols-3 gap-2 h-[80rem]">
                <aside className="col-span-1">
                    <MarketList />
                </aside>

                <section className="col-span-2">
                    {children}
                </section>
            </div>
        </main>
    );
} 