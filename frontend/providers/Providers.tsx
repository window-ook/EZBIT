'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import Navbar from '@/components/shared/Navbar';
import AuthProvider from '@/providers/AuthProvider';
import MarketListLayout from '@/components/shared/MarketListLayout';
import { TickerProvider } from './TickerProvider';

const ReactQueryDevtools = dynamic(() => import('@tanstack/react-query-devtools').then(mod => mod.ReactQueryDevtools), {
    ssr: false,
});

export default function Providers({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        retry: (failureCount, error) => {
                            // 네트워크 에러인 경우에만 재시도
                            if (error?.name === 'NetworkError') return failureCount < 3;
                            return false;
                        },
                        staleTime: 5 * 60 * 1000,
                        gcTime: 10 * 60 * 1000, // 구 cacheTime
                        refetchOnWindowFocus: false,
                        refetchOnReconnect: 'always',
                    },
                },
            }),
    );

    // 조건부 MarketListLayout 적용 경로
    const showMarketListLayout = [
        '/history',
        '/exchange',
        '/auto-portfolio',
        '/my-assets',
    ].some(prefix => pathname.startsWith(prefix));

    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                {pathname !== '/' && <Navbar />}
                {showMarketListLayout
                    ? (
                        <TickerProvider>
                            <MarketListLayout>{children}</MarketListLayout>
                        </TickerProvider>
                    )
                    : children}
                <ReactQueryDevtools initialIsOpen={false} />
            </AuthProvider>
        </QueryClientProvider>
    );
}
