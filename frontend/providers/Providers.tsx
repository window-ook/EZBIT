'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TickerProvider } from '@/providers/TickerProvider';
import dynamic from 'next/dynamic';
import Navbar from '@/components/shared/Navbar';
import AuthProvider from '@/providers/AuthProvider';
import MarketListProvider from '@/providers/MarketListProvider';

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

    const tickerAndMarketListProviderPaths = [
        '/history',
        '/exchange',
        '/portfolio-pilot',
        '/my-assets',
        '/trends',
    ].some(prefix => pathname.startsWith(prefix));

    const content = tickerAndMarketListProviderPaths ?
        <TickerProvider>
            <MarketListProvider>{children}</MarketListProvider>
        </TickerProvider> : children;

    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <Navbar />
                <div className={pathname !== '/' ? 'pt-20 lg:pt-24' : ''}>
                    {content}
                </div>
                <ReactQueryDevtools initialIsOpen={false} />
            </AuthProvider>
        </QueryClientProvider>
    );
}