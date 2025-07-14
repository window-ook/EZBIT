import { Metadata } from 'next';
import { Suspense } from 'react';
import { getExchangeRate } from '@/actions/trends/getExchangeRate';
import { ErrorBoundary } from 'react-error-boundary';
import { ExchangeRateErrorFallback } from '@/components/trends/fallback/ExchangeRateErrorFallback';
import { RisedCoinsErrorFallback } from '@/components/trends/fallback/RisedCoinsErrorFallback';
import { SituationErrorFallback } from '@/components/trends/fallback/SituationErrorFallback';
import { TopicsErrorFallback } from '@/components/trends/fallback/TopicsErrorFallback';
import { YoutubeVideosErrorFallback } from '@/components/trends/fallback/YoutubeVideosErrorFallback';
import { Skeleton } from '@/components/trends/Skeleton';
import { Card } from '@/components/shadcn-ui/card';
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

const CARD_STYLE = 'p-4 bg-card-background';

export default async function TrendsPage() {
    const exchangeRates = await getExchangeRate();

    return (
        <main className="py-6 flex flex-col items-center contents-container">
            <div className="w-full grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-6 h-full">
                {/* 환율 */}
                <section className="col-start-1 h-full">
                    <Card className={CARD_STYLE}>
                        <ErrorBoundary FallbackComponent={ExchangeRateErrorFallback}>
                            <Suspense fallback={<Skeleton />}>
                                <ExchangeRate exchangeRates={exchangeRates} />
                            </Suspense>
                        </ErrorBoundary>
                    </Card>
                </section>

                {/* 상승률 TOP5 */}
                <section className="col-start-1 lg:col-start-2 row-span-2 h-full gap-4">
                    <Card className={CARD_STYLE}>
                        <ErrorBoundary FallbackComponent={RisedCoinsErrorFallback}>
                            <Suspense fallback={<Skeleton />}>
                                <PrefetchedRisedCoins>
                                    <RisedCoins />
                                </PrefetchedRisedCoins>
                            </Suspense>
                        </ErrorBoundary>
                    </Card>
                </section>

                {/* 시황 + 토픽 */}
                <section className="col-start-1 grid grid-rows-[auto,1fr] gap-4 h-full">
                    <Card className={CARD_STYLE}>
                        <ErrorBoundary FallbackComponent={SituationErrorFallback}>
                            <Suspense fallback={<Skeleton />}>
                                <PrefetchedSituation>
                                    <Situation />
                                </PrefetchedSituation>
                            </Suspense>
                        </ErrorBoundary>
                    </Card>
                    <Card className={`${CARD_STYLE} h-full`}>
                        <ErrorBoundary FallbackComponent={TopicsErrorFallback}>
                            <Suspense fallback={<Skeleton />}>
                                <PrefetchedTopics>
                                    <Topics />
                                </PrefetchedTopics>
                            </Suspense>
                        </ErrorBoundary>
                    </Card>
                </section>

                {/* 유튜브 영상 */}
                <section className="col-start-1 col-span-2 h-full">
                    <Card className={CARD_STYLE}>
                        <ErrorBoundary FallbackComponent={YoutubeVideosErrorFallback}>
                            <Suspense fallback={<Skeleton />}>
                                <PrefetchedYoutubeVideos>
                                    <YoutubeVideos />
                                </PrefetchedYoutubeVideos>
                            </Suspense>
                        </ErrorBoundary>
                    </Card>
                </section>
            </div>
        </main>
    );
}