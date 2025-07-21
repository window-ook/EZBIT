import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { userQuery } from '@/queries/supabase/user.query';
import { holdingsQuery } from '@/queries/supabase/holdings.query';
import { fetchUserForPrefetch } from '@/lib/data/fetchUserForPrefetch';
import { fetchHoldingsForPrefetch } from '@/lib/data/fetchHoldingsForPrefetch';
import React from 'react';

export default async function PrefetchedUserData({
    children,
    includePortfolioRecommendData = false
}: {
    children: React.ReactNode;
    includePortfolioRecommendData?: boolean;
}) {
    const queryClient = new QueryClient();

    try {
        const prefetchPromises = [
            // 기본 사용자 데이터 (Prefetch 전용 함수 사용)
            queryClient.prefetchQuery({
                queryKey: userQuery.all(),
                queryFn: fetchUserForPrefetch,
                staleTime: 5 * 60 * 1000,
                gcTime: 10 * 60 * 1000
            }),
            queryClient.prefetchQuery({
                queryKey: holdingsQuery.all(),
                queryFn: fetchHoldingsForPrefetch,
                staleTime: 5 * 60 * 1000,
                gcTime: 10 * 60 * 1000
            })
        ];

        // 포트폴리오 페이지용 추가 데이터는 더 이상 필요 없음
        // 모든 TOP 코인 데이터는 실시간 TickerProvider 기반으로 처리됨
        if (includePortfolioRecommendData) {
            console.log('✅ 포트폴리오 데이터: 실시간 TickerProvider 기반으로 즉시 로드');
        }

        // 🚀 모든 데이터를 병렬로 로딩
        const results = await Promise.allSettled(prefetchPromises);

        const successCount = results.filter(r => r.status === 'fulfilled').length;
        const failureCount = results.filter(r => r.status === 'rejected').length;

        console.log(`✅ 데이터 프리페치 완료: ${successCount}개 성공, ${failureCount}개 실패`);

        // 실시간 데이터로 변경되어 더 이상 prefetch 실패 처리 불필요

    } catch (error) {
        console.error('❌ 데이터 프리페치 전체 실패:', error);

        // 실시간 데이터로 변경되어 더 이상 초기화 불필요
    }

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            {children}
        </HydrationBoundary>
    );
}