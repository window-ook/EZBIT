import { Metadata } from 'next';
import { getExchangeRate } from '@/actions/trends/getExchangeRate';
import { ErrorBoundaryWrapper } from '@/components/shared/ErrorBoundaryWrapper';
import { Suspense } from 'react';
import { Skeleton } from '@/components/trends/Skeleton';
import ExchangeRate from '@/components/trends/ExchangeRate';
import RisedCoins from '@/components/trends/RisedCoins';
import Situation from '@/components/trends/Situation';
import Topics from '@/components/trends/Topics';
import YoutubeVideos from '@/components/trends/YoutubeVideos';
import PrefetchedRisedCoins from '@/components/trends/prefetched/PrefetchedRisedCoins';
import PrefetchedTopics from '@/components/trends/prefetched/PrefetchedTopics';
import PrefetchedYoutubeVideos from '@/components/trends/prefetched/PrefetchedYoutubeVideos';
import PrefetchedSituation from '@/components/trends/prefetched/PrefetchedSituation';

export const metadata: Metadata = {
    title: '트렌드 : EZBIT',
    description: '최신 코인 관련 트렌드 정보를 확인하세요',
    keywords: ['코인', '트렌드', '영상', '상승 코인'],
};

export const dynamic = 'force-dynamic';

export default async function TrendsPage() {
    const exchangeRates = await getExchangeRate();

    return (
        <main className="py-6 flex flex-col items-center contents-container">
            <div className="w-full grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-6 h-full">
                {/* 환율 */}
                <section className="col-start-1 h-full">
                    <ErrorBoundaryWrapper
                        featureName='환율'
                        message='환율 데이터 로딩 중 문제가 발생했습니다.'
                    >
                        <Suspense fallback={<Skeleton />}>
                            <ExchangeRate exchangeRates={exchangeRates} />
                        </Suspense>
                    </ErrorBoundaryWrapper>
                </section>

                {/* 상승률 TOP5 */}
                <section className="col-start-1 lg:col-start-2 row-span-2 h-full gap-4">
                    <ErrorBoundaryWrapper
                        featureName='기간별 상승률 TOP5'
                        message='기간별 상승률 TOP5 데이터 로딩 중 문제가 발생했습니다.'
                    >
                        <Suspense fallback={<Skeleton />}>
                            <PrefetchedRisedCoins>
                                <RisedCoins />
                            </PrefetchedRisedCoins>
                        </Suspense>
                    </ErrorBoundaryWrapper>
                </section>

                {/* 시황 + 토픽 */}
                <section className="col-start-1 grid grid-rows-[auto,1fr] gap-4 h-full">
                    <div>
                        <ErrorBoundaryWrapper
                            featureName='시황'
                            message='시황 데이터 로딩 중 문제가 발생했습니다.'
                        >
                            <Suspense fallback={<Skeleton />}>
                                <PrefetchedSituation>
                                    <Situation />
                                </PrefetchedSituation>
                            </Suspense>
                        </ErrorBoundaryWrapper>
                    </div>
                    <div className="h-full">
                        <ErrorBoundaryWrapper
                            featureName='토픽'
                            message='토픽 데이터 로딩 중 문제가 발생했습니다.'
                        >
                            <Suspense fallback={<Skeleton />}>
                                <PrefetchedTopics>
                                    <Topics />
                                </PrefetchedTopics>
                            </Suspense>
                        </ErrorBoundaryWrapper>
                    </div>
                </section>

                {/* 유튜브 영상 */}
                <section className="col-start-1 col-span-2 h-full">
                    <ErrorBoundaryWrapper
                        featureName='유튜브 영상'
                        message='유튜브 영상 데이터 로딩 중 문제가 발생했습니다.'
                    >
                        <Suspense fallback={<Skeleton />}>
                            <PrefetchedYoutubeVideos>
                                <YoutubeVideos />
                            </PrefetchedYoutubeVideos>
                        </Suspense>
                    </ErrorBoundaryWrapper>
                </section>
            </div>
        </main>
    );
}