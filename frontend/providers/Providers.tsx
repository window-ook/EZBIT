'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import Navbar from '@/components/shared/Navbar';
import AuthProvider from './AuthProvider';

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
                        staleTime: 1000 * 60 * 10,
                        gcTime: 1000 * 60 * 10,
                    },
                },
            }),
    );

    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                {pathname !== '/' && <Navbar />}
                {children}
                <ReactQueryDevtools initialIsOpen={false} />
            </AuthProvider>
        </QueryClientProvider>
    );
}
