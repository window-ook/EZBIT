'use client';

import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import Navbar from '@/components/shared/Navbar';
import { usePathname } from 'next/navigation';

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
            {pathname !== '/' && <Navbar />}
            {children}
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
}
