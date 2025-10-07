'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TickerProvider } from '@/providers/TickerProvider';
import dynamic from 'next/dynamic';
import Navbar from '@/components/shared/Navbar';
import AuthProvider from '@/providers/AuthProvider';
import GuestOnlyProvider from '@/providers/GuestOnlyProvider';
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

    // AuthProvider 적용 경로 (인증 필요한 페이지만)
    const AuthRequiredPaths = ['/history', '/my-assets'].some(prefix => pathname.startsWith(prefix));

    // GuestOnlyProvider 적용 경로 (로그인 시 차단할 페이지)
    const GuestOnlyPaths = ['/signin', '/signup', '/reset-password'].some(prefix => pathname.startsWith(prefix));

    const content = TickerProviderPaths && MarketListLayoutPaths ? (
        <TickerProvider>
            <MarketListLayout>{children}</MarketListLayout>
        </TickerProvider>
    ) : (
        children
    );

    return (
        <QueryClientProvider client={queryClient}>
            {pathname !== '/' && <Navbar />}
            {AuthRequiredPaths ? (
                <AuthProvider>{content}</AuthProvider>
            ) : GuestOnlyPaths ? (
                <GuestOnlyProvider>{content}</GuestOnlyProvider>
            ) : (
                content
            )}
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
}