'use client';

import { Card } from '@/components/shadcn-ui/card';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import Button from '@/components/shared/Button';

interface IOrderBoxErrorFallback {
    error: Error;
    resetErrorBoundary: () => void;
}

export function OrderBoxErrorFallback({ error, resetErrorBoundary }: IOrderBoxErrorFallback) {
    const handleRetry = () => {
        console.error('주문하기 렌더링 에러:', error);
        resetErrorBoundary();
    };

    const handleRefreshPage = () => window.location.reload();

    return (
        <Card className="w-full h-[26rem] mx-auto p-4 flex flex-col items-center justify-center gap-4">
            <div className="flex items-center gap-2 text-red-500">
                <AlertTriangle size={24} />
                <h3 className="text-lg font-semibold">주문 기능 오류</h3>
            </div>

            <div className="text-center text-sm text-gray-600">
                <p>유저 데이터 또는 보유 자산 로딩 중 문제가 발생했습니다.</p>
                <p className="mt-1">아래 버튼을 눌러 다시 시도해주세요.</p>
            </div>

            <div className="flex gap-2">
                <Button
                    onClick={handleRetry}
                    customClassName="flex items-center gap-2 bg-blue-500 hover:bg-blue-600"
                >
                    <RefreshCw size={16} />
                    다시 시도
                </Button>

                <Button
                    onClick={handleRefreshPage}
                    customClassName="bg-gray-500 hover:bg-gray-600"
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