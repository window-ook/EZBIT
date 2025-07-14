'use client';

import { Card } from '@/components/shadcn-ui/card';
import { TriangleAlert, RefreshCw } from 'lucide-react';
import Button from '@/components/shared/Button';

interface IErrorFallback {
    featureName: string;
    message: string;
    error: Error;
    resetErrorBoundary: () => void;
}

export function ErrorFallback({ featureName, message, error, resetErrorBoundary }: IErrorFallback) {
    const handleRetry = () => {
        console.error('주문하기 렌더링 에러:', error);
        resetErrorBoundary();
    };

    const handleRefreshPage = () => window.location.reload();

    return (
        <Card className="w-full h-[26rem] mx-auto p-4 flex flex-col items-center justify-center gap-4">
            <div className="flex items-center gap-2 text-error">
                <TriangleAlert className="size-6" />
                <h3 className="text-lg font-semibold">{featureName} 기능 오류</h3>
            </div>

            <div className="flex flex-col gap-1 text-center text-sm text-description">
                <p>{message}</p>
            </div>

            <div className="flex gap-2">
                <Button
                    customClassName="flex items-center gap-2"
                    onClick={handleRetry}
                >
                    <RefreshCw className="size-4" />
                    다시 시도
                </Button>

                <Button
                    onClick={handleRefreshPage}
                >
                    페이지 새로고침
                </Button>
            </div>

            {/* 개발 환경에서만 에러 상세 정보 표시 */}
            {process.env.NODE_ENV === 'development' && (
                <details className="mt-4 text-xs text-gray-400">
                    <summary className="cursor-pointer">에러 상세 정보</summary>
                    <pre className="mt-2 p-2 bg-gray-100 rounded text-left overflow-auto">
                        {error.message}
                        {error.stack}
                    </pre>
                </details>
            )}
        </Card>
    );
}