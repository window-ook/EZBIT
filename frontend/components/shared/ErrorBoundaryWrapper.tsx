'use client';

import { ErrorBoundary } from 'react-error-boundary';
import { ErrorFallback } from '@/components/shared/ErrorFallback';
import { ReactNode } from 'react';

interface IErrorBoundaryWrapper {
    featureName: string;
    message: string;
    children: ReactNode;
    onError?: (error: Error) => void;
}

export function ErrorBoundaryWrapper({
    featureName,
    message,
    children,
    onError
}: IErrorBoundaryWrapper) {
    return (
        <ErrorBoundary
            FallbackComponent={(props) => (
                <ErrorFallback
                    {...props}
                    featureName={featureName}
                    message={message}
                />
            )}
            onError={onError || ((error, errorInfo) => {
                console.error(`${featureName} 에러:`, error, errorInfo);
            })}
        >
            {children}
        </ErrorBoundary>
    );
}