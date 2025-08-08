'use client';

import { usePathname } from 'next/navigation';
import React, { useState, useEffect } from "react";
import MarketList from '@/components/shared/MarketList';

export default function MarketListLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const [isTrendsPage, setIsTrendsPage] = useState(false);

    useEffect(() => {
        setIsTrendsPage(pathname.startsWith('/trends'));
    }, [pathname]);

    if (isTrendsPage) {
        // 트렌드 페이지는 MarketList를 숨기고 전체 너비 사용
        return (
            <>
                {/* MarketList는 숨기지만 WebSocket 연결을 위해 렌더링(DOM 차지) */}
                <div className="hidden">
                    <MarketList />
                </div>
                {children}
            </>
        );
    }

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