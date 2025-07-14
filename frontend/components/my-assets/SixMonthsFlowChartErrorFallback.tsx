"use client";

import { AlertTriangle, RefreshCw, LineChart } from "lucide-react";
import Button from "@/components/shared/Button";

interface SixMonthsFlowChartErrorFallbackProps {
    error: Error;
    resetErrorBoundary: () => void;
}

export function SixMonthsFlowChartErrorFallback({ error, resetErrorBoundary }: SixMonthsFlowChartErrorFallbackProps) {
    const handleRetry = () => {
        console.error("SixMonthsFlowChart Error:", error);
        resetErrorBoundary();
    };
    const handleRefreshPage = () => window.location.reload();

    return (
        <section className="contents-container flex flex-col gap-4 items-center justify-center py-8">
            <header>
                <h2 className="text-xl sm:text-2xl font-bold text-main">6개월 흐름 차트</h2>
            </header>
            <div className="flex items-center gap-2 text-red-500">
                <AlertTriangle size={24} />
                <h3 className="text-lg font-semibold">6개월 흐름 정보 오류</h3>
            </div>
            <div className="text-center text-sm text-gray-600">
                <p>6개월 흐름 차트 데이터 로딩 중 문제가 발생했습니다.</p>
                <p className="mt-1">아래 버튼을 눌러 다시 시도해주세요.</p>
            </div>
            <div className="flex gap-2">
                <Button onClick={handleRetry} customClassName="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-xs sm:text-sm">
                    <RefreshCw size={16} />다시 시도
                </Button>
                <Button onClick={handleRefreshPage} customClassName="bg-gray-500 hover:bg-gray-600 text-xs sm:text-sm">
                    페이지 새로고침
                </Button>
            </div>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg flex items-center gap-2 text-gray-600">
                <LineChart size={16} />
                <span className="text-sm font-medium">6개월 흐름 정보는 잠시 후 다시 시도해 주세요.</span>
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
        </section>
    );
} 