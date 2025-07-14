"use client";

import { AlertTriangle, RefreshCw, MessageCircle } from "lucide-react";
import Button from "@/components/shared/Button";

interface TopicsErrorFallbackProps {
    error: Error;
    resetErrorBoundary: () => void;
}

export function TopicsErrorFallback({ error, resetErrorBoundary }: TopicsErrorFallbackProps) {
    const handleRetry = () => {
        console.error("Topics Error:", error);
        resetErrorBoundary();
    };

    const handleRefreshPage = () => window.location.reload();

    return (
        <section className="contents-container flex flex-col gap-4">
            <header>
                <h2 className="text-xl sm:text-2xl font-bold text-main">토픽</h2>
            </header>
            <div className="flex flex-col items-center justify-center py-8 gap-4">
                <div className="flex items-center gap-2 text-red-500">
                    <AlertTriangle size={24} />
                    <h3 className="text-lg font-semibold">토픽 정보 오류</h3>
                </div>
                <div className="text-center text-sm text-gray-600">
                    <p>토픽 데이터 로딩 중 문제가 발생했습니다.</p>
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
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                        <MessageCircle size={16} />
                        <span className="text-sm font-medium">참고 토픽 정보</span>
                    </div>
                    <div className="text-xs text-gray-500">
                        실시간 토픽 정보는 코인 관련 커뮤니티, 트위터 등에서 확인하실 수 있습니다.
                    </div>
                </div>
                {process.env.NODE_ENV === "development" && (
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