import { Suspense, ReactNode } from 'react';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { Skeleton } from '@/components/trends/Skeleton';

interface ITrendsSection {
    children: ReactNode;
    fallbackTitle: string;
    fallbackDesc: string;
}

export default function ErrorBoundaryAndSuspense({
    children,
    fallbackTitle,
    fallbackDesc,
}: ITrendsSection) {
    return (
        <ErrorBoundary
            fallback={
                <div className="w-full p-8 text-center">
                    <h2 className="text-xl font-semibold text-red-600 mb-2">{fallbackTitle}</h2>
                    <p className="text-gray-600">{fallbackDesc}</p>
                </div>
            }
        >
            <Suspense fallback={<Skeleton />}>{children}</Suspense>
        </ErrorBoundary>
    );
} 