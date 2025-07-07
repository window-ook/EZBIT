'use client';

import React from "react";
import MarketList from '@/components/shared/MarketList';

export default function MarketListLayout({ children }: { children: React.ReactNode }) {
    return (
        <main className="contents-container py-6">
            <div className="grid grid-cols-[1fr_1fr_1fr] grid-rows-[25rem_3fr] gap-2 h-full sm:h-[50rem]">
                {/* Column 1 - 마켓 리스트 */}
                <aside className="row-span-2">
                    <MarketList />
                </aside>

                {/* Column 2-3 - 본문 */}
                <section className="col-span-2 row-span-2">
                    {children}
                </section>
            </div>
        </main>
    );
} 