'use client';

import { AlertTriangle, RefreshCw, TrendingUp } from 'lucide-react';
import Button from '@/components/shared/Button';

interface ExchangeRateErrorFallbackProps {
    error: Error;
    resetErrorBoundary: () => void;
}

export function ExchangeRateErrorFallback({ error, resetErrorBoundary }: ExchangeRateErrorFallbackProps) {
    const handleRetry = () => {
        // 에러 로깅
        console.error('ExchangeRate Error:', error);

        // 에러 바운더리 리셋
        resetErrorBoundary();
    };

    const handleRefreshPage = () => {
        window.location.reload();
    };

    return (
        <section className="contents-container flex flex-col gap-4">
            <header>
                <h2 className="text-xl sm:text-2xl font-bold text-main">오늘 환율</h2>
            </header>

            <div className="flex flex-col items-center justify-center py-8 gap-4">
                <div className="flex items-center gap-2 text-red-500">
                    <AlertTriangle size={24} />
                    <h3 className="text-lg font-semibold">환율 정보 오류</h3>
                </div>

                <div className="text-center text-sm text-gray-600">
                    <p>환율 데이터 로딩 중 문제가 발생했습니다.</p>
                    <p className="mt-1">아래 버튼을 눌러 다시 시도해주세요.</p>
                </div>

                <div className="flex gap-2">
                    <Button
                        onClick={handleRetry}
                        customClassName="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-xs sm:text-sm"
                    >
                        <RefreshCw size={16} />
                        다시 시도
                    </Button>

                    <Button
                        onClick={handleRefreshPage}
                        customClassName="bg-gray-500 hover:bg-gray-600 text-xs sm:text-sm"
                    >
                        페이지 새로고침
                    </Button>
                </div>

                {/* 대체 콘텐츠 - 기본 환율 정보 표시 */}
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                        <TrendingUp size={16} />
                        <span className="text-sm font-medium">참고 환율 정보</span>
                    </div>
                    <div className="text-xs text-gray-500">
                        실시간 환율 정보는 한국은행, 네이버 금융 등에서 확인하실 수 있습니다.
                    </div>
                </div>

                {/* 개발 환경에서만 에러 상세 정보 표시 */}
                {process.env.NODE_ENV === 'development' && (
                    <details className="mt-4 text-xs text-gray-400 max-w-full">
                        <summary className="cursor-pointer">에러 상세 정보</summary>
                        <pre className="mt-2 p-2 bg-gray-100 rounded text-left overflow-auto whitespace-pre-wrap break-words">
                            {error.message}
                            {error.stack && `\n\n${error.stack}`}
                        </pre>
                    </details>
                )}
            </div>
        </section>
    );
}