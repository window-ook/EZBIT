'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TickerProvider } from '@/providers/TickerProvider';
import dynamic from 'next/dynamic';
import Navbar from '@/components/shared/Navbar';
import AuthProvider from '@/providers/AuthProvider';
import MarketListLayout from '@/components/shared/MarketListLayout';

const ReactQueryDevtools = dynamic(() => import('@tanstack/react-query-devtools').then(mod => mod.ReactQueryDevtools), {
    ssr: false,
});

const TWO_HOURS = 2 * 60 * 60 * 1000;

export default function Providers({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        retry: (failureCount, error) => {
                            if (error?.name === 'NetworkError') return failureCount < 3;
                            return false;
                        },
                        staleTime: TWO_HOURS,
                        gcTime: TWO_HOURS * 2,
                        refetchOnWindowFocus: false,
                        refetchOnReconnect: 'always',
                    },
                },
            }),
    );

    // MarketListLayout 적용 경로 - MarketList 렌더링
    const showMarketListLayout = [
        '/history',
        '/exchange',
        '/portfolio-pilot',
        '/my-assets',
        '/trends',
    ].some(prefix => pathname.startsWith(prefix));

    // TickerProvider 적용 경로 - ticker 데이터 필요한 페이지
    const needsTickerProvider = [
        '/history',
        '/exchange',
        '/portfolio-pilot',
        '/my-assets',
        '/trends',
    ].some(prefix => pathname.startsWith(prefix));

    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                {pathname !== '/' && <Navbar />}
                {needsTickerProvider ? (
                    <TickerProvider>
                        {showMarketListLayout ? (
                            <MarketListLayout>{children}</MarketListLayout>
                        ) : (
                            children
                        )}
                    </TickerProvider>
                ) : (
                    children
                )}
                <ReactQueryDevtools initialIsOpen={false} />
            </AuthProvider>
        </QueryClientProvider>
    );
}
