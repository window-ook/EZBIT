import { Metadata } from 'next';
import { getExchangeRate } from '@/actions/trends/getExchangeRate';
import { ErrorBoundaryWrapper } from '@/components/shared/ErrorBoundaryWrapper';
import { Suspense } from 'react';
import { Skeleton } from '@/components/trends/Skeleton';
import ExchangeRate from '@/components/trends/ExchangeRate';
import Situation from '@/components/trends/Situation';
import Topics from '@/components/trends/Topics';
import WeeklyTopRisedCoins from '@/components/trends/WeeklyTopRisedCoins';
import DailyTopBidCoins from '@/components/trends/DailyTopBidCoins';
import YoutubeVideos from '@/components/trends/YoutubeVideos';
import PrefetchedYoutubeVideos from '@/components/trends/prefetched/PrefetchedYoutubeVideos';
import PrefetchedTopics from '@/components/trends/prefetched/PrefetchedTopics';
import PrefetchedSituation from '@/components/trends/prefetched/PrefetchedSituation';
import PrefetchedWeeklyTopRisedCoins from '@/components/trends/prefetched/PrefetchedWeeklyTopRisedCoins';
import PrefetchedDailyTopBidCoins from '@/components/trends/prefetched/PrefetchedDailyTopBidCoins';

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
        <main className="contents-container min-h-screen py-6 flex flex-col items-center gap-2">
            <section className="w-full h-full flex gap-2">
                {/* 환율, 시황, 토픽 */}
                <section className="w-4/7 h-full flex flex-col gap-2">
                    <ErrorBoundaryWrapper
                        featureName='환율'
                        message='환율 데이터 로딩 중 문제가 발생했습니다.'
                    >
                        <Suspense fallback={<Skeleton height='h-[120px]' />}>
                            <ExchangeRate exchangeRates={exchangeRates} />
                        </Suspense>
                    </ErrorBoundaryWrapper>
                    <ErrorBoundaryWrapper
                        featureName='시황'
                        message='시황 데이터 로딩 중 문제가 발생했습니다.'
                    >
                        <Suspense fallback={<Skeleton height='h-[150px]' />}>
                            <PrefetchedSituation>
                                <Situation today={TODAY} />
                            </PrefetchedSituation>
                        </Suspense>
                    </ErrorBoundaryWrapper>
                    <ErrorBoundaryWrapper
                        featureName='토픽'
                        message='토픽 데이터 로딩 중 문제가 발생했습니다.'
                    >
                        <Suspense fallback={<Skeleton height='h-[500px]' />}>
                            <PrefetchedTopics>
                                <Topics />
                            </PrefetchedTopics>
                        </Suspense>
                    </ErrorBoundaryWrapper>
                </section>

                {/* 주간 상승률 TOP 10, 일 매수 체결강도 TOP 10 */}
                <section className="w-3/7 h-[902.73px] flex flex-col gap-2">
                    <ErrorBoundaryWrapper
                        featureName='주간 상승률 TOP 10'
                        message='주간 상승률 데이터 로딩 중 문제가 발생했습니다.'
                    >
                        <Suspense fallback={<Skeleton height='h-[580px]' />}>
                            <PrefetchedWeeklyTopRisedCoins>
                                <WeeklyTopRisedCoins />
                            </PrefetchedWeeklyTopRisedCoins>
                        </Suspense>
                    </ErrorBoundaryWrapper>
                    <ErrorBoundaryWrapper
                        featureName='일간 매수 TOP 5'
                        message='일간 매수 데이터 로딩 중 문제가 발생했습니다.'
                    >
                        <Suspense fallback={<Skeleton height='h-[315px]' />}>
                            <PrefetchedDailyTopBidCoins>
                                <DailyTopBidCoins />
                            </PrefetchedDailyTopBidCoins>
                        </Suspense>
                    </ErrorBoundaryWrapper>
                </section>
            </section>

            {/* 유튜브 영상 */}
            <section className="w-full flex items-center gap-2">
                <ErrorBoundaryWrapper
                    featureName='유튜브 영상'
                    message='유튜브 영상 데이터 로딩 중 문제가 발생했습니다.'
                >
                    <Suspense fallback={<Skeleton height='h-[200px]' />}>
                        <PrefetchedYoutubeVideos>
                            <YoutubeVideos />
                        </PrefetchedYoutubeVideos>
                    </Suspense>
                </ErrorBoundaryWrapper>
            </section>
        </main>
    );
}