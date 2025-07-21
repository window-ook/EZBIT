import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { userQuery } from '@/queries/supabase/user.query';
import { holdingsQuery } from '@/queries/supabase/holdings.query';
import { weeklyTopRisedCoinsQuery } from '@/queries/trends/weeklyTopRisedCoins.query';
import { dailyTopBidCoinsQuery } from '@/queries/trends/dailyTopBidCoins.query';
import { marketCapTopCoinsQuery } from '@/queries/trends/marketCapTopCoins.query';
import { fetchUserForPrefetch } from '@/lib/data/fetchUserForPrefetch';
import { fetchHoldingsForPrefetch } from '@/lib/data/fetchHoldingsForPrefetch';
import { fetchWeeklyTopRisedCoins } from '@/lib/data/fetchWeeklyTopRisedCoins';
import { fetchDailyTopBidCoins } from '@/lib/data/fetchDailyTopBidCoins';
import { fetchMarketCapTopCoins } from '@/lib/data/fetchMarketCapTopCoins';
import {
    USE_MOCK_TRENDS_DATA,
    fetchWeeklyTopRisedMock,
    fetchDailyTopBidMock,
    fetchMarketCapTopMock
} from '@/lib/data/mockTrendsData';
import React from 'react';

interface Props {
    children: React.ReactNode;
    includePortfolioData?: boolean; // 포트폴리오 데이터 포함 여부
}

export default async function PrefetchedUserData({
    children,
    includePortfolioData = false
}: Props) {
    const queryClient = new QueryClient();

    try {
        const prefetchPromises = [
            // 기본 사용자 데이터 (Prefetch 전용 함수 사용)
            queryClient.prefetchQuery({
                queryKey: userQuery.all(),
                queryFn: fetchUserForPrefetch,
                staleTime: 5 * 60 * 1000, // 5분
                gcTime: 10 * 60 * 1000    // 10분
            }),
            queryClient.prefetchQuery({
                queryKey: holdingsQuery.all(),
                queryFn: fetchHoldingsForPrefetch,
                staleTime: 5 * 60 * 1000, // 5분
                gcTime: 10 * 60 * 1000    // 10분
            })
        ];

        // 포트폴리오 페이지에서만 추가 데이터 로딩
        if (includePortfolioData) {
            console.log('🚀 포트폴리오 매수 옵션 병렬 prefetch 시작...');

            prefetchPromises.push(
                queryClient.prefetchQuery({
                    queryKey: weeklyTopRisedCoinsQuery.all(),
                    queryFn: USE_MOCK_TRENDS_DATA ? fetchWeeklyTopRisedMock : fetchWeeklyTopRisedCoins,
                    staleTime: 5 * 60 * 1000, // 5분
                    gcTime: 20 * 60 * 1000    // 20분
                }),
                queryClient.prefetchQuery({
                    queryKey: dailyTopBidCoinsQuery.all(),
                    queryFn: USE_MOCK_TRENDS_DATA ? fetchDailyTopBidMock : fetchDailyTopBidCoins,
                    staleTime: 3 * 60 * 1000, // 3분
                    gcTime: 12 * 60 * 1000    // 12분
                }),
                queryClient.prefetchQuery({
                    queryKey: marketCapTopCoinsQuery.all(),
                    queryFn: USE_MOCK_TRENDS_DATA ? fetchMarketCapTopMock : fetchMarketCapTopCoins,
                    staleTime: 5 * 60 * 1000, // 5분
                    gcTime: 20 * 60 * 1000    // 20분
                })
            );
        }

        // 🚀 모든 데이터를 병렬로 로딩
        const results = await Promise.allSettled(prefetchPromises);

        const successCount = results.filter(r => r.status === 'fulfilled').length;
        const failureCount = results.filter(r => r.status === 'rejected').length;

        console.log(`✅ 데이터 prefetch 완료: ${successCount}개 성공, ${failureCount}개 실패`);

        // 실패한 쿼리들을 빈 데이터로 초기화 (포트폴리오 데이터만)
        if (includePortfolioData) {
            results.forEach((result, index) => {
                if (result.status === 'rejected' && index >= 2) {
                    const queries = [weeklyTopRisedCoinsQuery, dailyTopBidCoinsQuery, marketCapTopCoinsQuery];
                    const queryIndex = index - 2;

                    console.warn(`⚠️ ${queries[queryIndex]} prefetch 실패, 빈 데이터로 초기화:`, result.reason);
                    queryClient.setQueryData(queries[queryIndex].all(), []);
                }
            });
        }

    } catch (error) {
        console.error('❌ 데이터 prefetch 전체 실패:', error);

        // 전체 실패 시 기본 데이터만 빈 값으로 초기화
        if (includePortfolioData) {
            queryClient.setQueryData(weeklyTopRisedCoinsQuery.all(), []);
            queryClient.setQueryData(dailyTopBidCoinsQuery.all(), []);
            queryClient.setQueryData(marketCapTopCoinsQuery.all(), []);
        }
    }

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            {children}
        </HydrationBoundary>
    );
}