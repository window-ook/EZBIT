import { Card } from '@/components/shadcn-ui/card';
import { Skeleton } from '@/components/trends/Skeleton';

export default function PortfolioRecommendationSkeleton() {
    return (
        <Card className="flex-1 flex flex-col gap-6 p-6 bg-gradient-to-br from-white to-blue-50/30 min-h-0">
            {/* 옵션 정보 섹션 스켈레톤 */}
            <div className="space-y-3">
                <div className='flex flex-col gap-1'>
                    <Skeleton height="h-8" />
                    <Skeleton height="h-5" />
                </div>
                <div className="px-4 py-3 bg-blue-50 rounded-xl border-l-4 border-main">
                    <Skeleton height="h-6" />
                </div>
            </div>

            {/* 투자 금액 설정 섹션 스켈레톤 */}
            <div className="space-y-4">
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <Skeleton height="h-4" />
                        <Skeleton height="h-8" />
                    </div>
                    <Skeleton height="h-6" />
                    <div className="flex justify-between text-xs text-description">
                        <Skeleton height="h-3" />
                        <Skeleton height="h-3" />
                    </div>
                </div>
                <div className="px-3 py-2 bg-amber-50 rounded-lg shadow-sm">
                    <Skeleton height="h-4" />
                </div>
            </div>

            {/* 포트폴리오 결과 제목 스켈레톤 */}
            <div className="space-y-2">
                <Skeleton height="h-6" />
                <Skeleton height="h-4" />
            </div>

            {/* 포트폴리오 아이템들 스켈레톤 */}
            {[1, 2, 3, 4, 5].map((index) => (
                <div key={index} className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between gap-2 w-full">
                        {/* 종목 정보 스켈레톤 */}
                        <div className='flex items-center gap-2'>
                            <div className="size-8 rounded-full bg-main/10 animate-pulse" />
                            <Skeleton height="h-6" />
                            <Skeleton height="h-4" />
                            <Skeleton height="h-4" />
                        </div>
                        {/* 매수 정보 스켈레톤 */}
                        <div className='flex items-center gap-4'>
                            <div className="flex flex-col gap-1 text-sm min-w-[100px]">
                                <Skeleton height="h-4" />
                                <Skeleton height="h-5" />
                            </div>
                            <div className="flex flex-col gap-1 text-sm min-w-[100px]">
                                <Skeleton height="h-4" />
                                <Skeleton height="h-5" />
                            </div>
                            <div className="flex flex-col gap-1 text-sm min-w-[60px]">
                                <Skeleton height="h-4" />
                                <Skeleton height="h-5" />
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {/* 포트폴리오 요약 스켈레톤 */}
            <div className="bg-gradient-to-r from-main/5 to-blue-50 rounded-lg p-4 border border-main/10 space-y-2">
                <div className="flex justify-between items-center">
                    <Skeleton height="h-6" />
                    <Skeleton height="h-7" />
                </div>
                <div className="flex justify-between items-center text-sm">
                    <Skeleton height="h-4" />
                    <Skeleton height="h-4" />
                </div>
                <div className="flex justify-between items-center text-sm">
                    <Skeleton height="h-4" />
                    <Skeleton height="h-4" />
                </div>
            </div>

            {/* 매수 버튼 스켈레톤 */}
            <div className="flex-1 py-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse" />
        </Card>
    );
} 