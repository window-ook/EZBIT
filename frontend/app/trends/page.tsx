import { Metadata } from 'next';
import { Suspense } from 'react';
import { getExchangeRate } from '@/actions/trends/getExchangeRate';
import { ErrorBoundaryWrapper } from '@/components/shared/ErrorBoundaryWrapper';
import { SkeletonForTrends } from '@/components/trends/SkeletonForTrends';
import ExchangeRate from '@/components/trends/ExchangeRate';
import Situation from '@/components/trends/Situation';
import Topics from '@/components/trends/Topics';
import TodayTopRisedCoins from '@/components/trends/TodayTopRisedCoins';
import TodayTopTradingVolumeCoins from '@/components/trends/TodayTopTradingVolumeCoins';
import YoutubeVideos from '@/components/trends/YoutubeVideos';
import YoutubeVideosPrefetcher from '@/components/trends/prefetched/YoutubeVideosPrefetcher';
import TopicsPrefetcher from '@/components/trends/prefetched/TopicsPrefetcher';
import SituationPrefetcher from '@/components/trends/prefetched/SituationPrefetcher';

export const metadata: Metadata = {
    title: '트렌드 : EZBIT',
    description: '최신 코인 관련 트렌드 정보를 확인하세요',
    keywords: ['코인', '트렌드', '영상', '상승 코인'],
};

export const dynamic = 'force-dynamic';

const TODAY = new Date().toISOString();

export default async function TrendsPage() {
    const exchangeRates = await getExchangeRate();

    return (
        <main className="contents-container py-4 sm:py-6 px-4 lg:px-0 flex flex-col items-center gap-2">
            <section className="w-full flex flex-col md:flex-row gap-2 items-stretch">
                {/* 환율, 시황, 토픽 */}
                <section className="w-full md:w-4/7 flex flex-col gap-2">
                    <ErrorBoundaryWrapper
                        featureName='환율'
                        message='환율 로딩 중 문제가 발생했습니다.'
                    >
                        <Suspense fallback={<SkeletonForTrends height='h-[120px]' type='exchange-rate' />}>
                            <ExchangeRate exchangeRates={exchangeRates} />
                        </Suspense>
                    </ErrorBoundaryWrapper>
                    <ErrorBoundaryWrapper
                        featureName='시황 뉴스'
                        message='시황 뉴스 로딩 중 문제가 발생했습니다.'
                    >
                        <Suspense fallback={<SkeletonForTrends height='h-[150px]' type='news-list' />}>
                            <SituationPrefetcher>
                                <Situation today={TODAY} />
                            </SituationPrefetcher>
                        </Suspense>
                    </ErrorBoundaryWrapper>
                    <ErrorBoundaryWrapper
                        featureName='토픽 뉴스'
                        message='토픽 뉴스 로딩 중 문제가 발생했습니다.'
                    >
                        <div className="flex-1">
                            <Suspense fallback={<SkeletonForTrends height='h-[500px]' type='news-list' />}>
                                <TopicsPrefetcher>
                                    <Topics />
                                </TopicsPrefetcher>
                            </Suspense>
                        </div>
                    </ErrorBoundaryWrapper>
                </section>

                {/* 실시간 상승률 TOP 10, 24시간 거래대금 TOP 5 */}
                <section className="w-full md:w-3/7 flex flex-col gap-2">
                    <ErrorBoundaryWrapper
                        featureName='실시간 상승률 TOP 10'
                        message='실시간 상승률 TOP 10 로딩 중 문제가 발생했습니다.'
                    >
                        <TodayTopRisedCoins />
                    </ErrorBoundaryWrapper>
                    <ErrorBoundaryWrapper
                        featureName='24시간 거래대금 TOP 5'
                        message='24시간 거래대금 TOP 5 로딩 중 문제가 발생했습니다.'
                    >
                        <TodayTopTradingVolumeCoins />
                    </ErrorBoundaryWrapper>
                </section>
            </section>

            {/* 유튜브 영상 */}
            <section className="w-full flex items-center gap-2">
                <ErrorBoundaryWrapper
                    featureName='유튜브 영상'
                    message='유튜브 영상 로딩 중 문제가 발생했습니다.'
                >
                    <Suspense fallback={<SkeletonForTrends height='h-[200px]' type='youtube-grid' />}>
                        <YoutubeVideosPrefetcher>
                            <YoutubeVideos />
                        </YoutubeVideosPrefetcher>
                    </Suspense>
                </ErrorBoundaryWrapper>
            </section>
        </main>
    );
}