'use client';

import { Card } from '@/components/shadcn-ui/card';
import { AlertTriangle, RefreshCw, BarChart3, PieChart } from 'lucide-react';
import Button from '@/components/shared/Button';

interface MyAssetsPageErrorFallbackProps {
    error: Error;
    resetErrorBoundary: () => void;
}

export function MyAssetsPageErrorFallback({ error, resetErrorBoundary }: MyAssetsPageErrorFallbackProps) {
    const handleRetry = () => {
        console.error('보유 자산 페이지 에러:', error);
        resetErrorBoundary();
    };

    const handleRefreshPage = () => {
        window.location.reload();
    };

    const handleGoToExchange = () => {
        window.location.href = '/exchange';
    };

    return (
        <main className="h-full w-full flex flex-col items-center justify-center gap-8 p-8 bg-gray-50">
            {/* 에러 헤더 */}
            <div className="flex flex-col items-center gap-4">
                <div className="flex items-center gap-3 text-red-500">
                    <AlertTriangle size={40} />
                    <h1 className="text-2xl sm:text-3xl font-bold">보유 자산 로딩 오류</h1>
                </div>

                <div className="text-center text-gray-600 max-w-lg">
                    <p className="text-lg mb-2">보유 자산 정보를 불러오는 중 문제가 발생했습니다.</p>
                    <p className="text-sm">
                        네트워크 연결 상태를 확인하시거나 잠시 후 다시 시도해주세요.
                    </p>
                </div>
            </div>

            {/* 액션 버튼들 */}
            <div className="flex flex-col sm:flex-row gap-3">
                <Button
                    onClick={handleRetry}
                    customClassName="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 px-6 py-3 text-white rounded-lg font-medium"
                >
                    <RefreshCw size={20} />
                    다시 시도
                </Button>

                <Button
                    onClick={handleRefreshPage}
                    customClassName="bg-gray-500 hover:bg-gray-600 px-6 py-3 text-white rounded-lg font-medium"
                >
                    페이지 새로고침
                </Button>
            </div>

            {/* 대체 방법 안내 카드들 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl w-full">
                {/* 거래소 페이지 이동 */}
                <Card
                    className="p-4 bg-blue-50 border-blue-200 cursor-pointer hover:bg-blue-100 transition-colors"
                    onClick={handleGoToExchange}
                >
                    <div className="flex items-center gap-3 text-blue-600 mb-3">
                        <BarChart3 size={20} />
                        <span className="font-medium">거래소에서 확인하기</span>
                    </div>
                    <p className="text-sm text-blue-600">
                        거래소 페이지에서 실시간 보유 현황과 주문 내역을 확인할 수 있습니다.
                    </p>
                </Card>

                {/* 외부 앱 안내 */}
                <Card className="p-4 bg-green-50 border-green-200">
                    <div className="flex items-center gap-3 text-green-600 mb-3">
                        <PieChart size={20} />
                        <span className="font-medium">업비트 앱에서 확인</span>
                    </div>
                    <p className="text-sm text-green-600">
                        업비트 모바일 앱에서 정확한 보유 자산과 수익률을 확인하실 수 있습니다.
                    </p>
                </Card>
            </div>

            {/* 로딩 상태 표시 (선택사항) */}
            <div className="text-center">
                <p className="text-xs text-gray-400 mb-2">문제가 지속될 경우</p>
                <p className="text-xs text-gray-500">
                    고객센터: support@ezbit.com | 카카오톡: @ezbit
                </p>
            </div>

            {/* 개발 환경에서만 에러 상세 정보 */}
            {process.env.NODE_ENV === 'development' && (
                <details className="mt-4 w-full max-w-2xl">
                    <summary className="cursor-pointer text-sm text-gray-400 hover:text-gray-600">
                        🔧 개발자 정보 (에러 상세)
                    </summary>
                    <Card className="mt-2 p-4 bg-gray-100">
                        <pre className="text-xs text-gray-700 overflow-auto whitespace-pre-wrap break-words">
                            <strong>Error Message:</strong>
                            {error.message}

                            {error.stack && (
                                <>
                                    <br /><br />
                                    <strong>Stack Trace:</strong>
                                    <br />
                                    {error.stack}
                                </>
                            )}
                        </pre>
                    </Card>
                </details>
            )}
        </main>
    );
}