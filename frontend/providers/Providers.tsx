'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TickerProvider } from '@/providers/TickerProvider';
import dynamic from 'next/dynamic';
import Navbar from '@/components/shared/Navbar';
import AuthProvider from '@/providers/AuthProvider';
import MarketListLayout from '@/components/shared/MarketListLayout';

const ReactQueryDevtools = dynamic(() => import('@tanstack/react-query-devtools').then(mod => mod.ReactQueryDevtools), { ssr: false });

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
                        staleTime: 30 * 60 * 1000,
                        gcTime: 30 * 60 * 1000 * 2,
                        refetchOnWindowFocus: false,
                        refetchOnReconnect: 'always',
                    },
                },
            }),
    );

    // MarketListLayout 적용 경로
    const MarketListLayoutPaths = [
        '/history',
        '/exchange',
        '/portfolio-pilot',
        '/my-assets',
        '/trends',
    ].some(prefix => pathname.startsWith(prefix));

    // TickerProvider 적용 경로
    const TickerProviderPaths = [
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
                {TickerProviderPaths && MarketListLayoutPaths ? (
                    <TickerProvider>
                        <MarketListLayout>{children}</MarketListLayout>
                    </TickerProvider>
                ) : (
                    children
                )}
                <ReactQueryDevtools initialIsOpen={false} />
            </AuthProvider>
        </QueryClientProvider>
    );
}