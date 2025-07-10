import { Metadata } from 'next';
import { getExchangeRate } from '@/actions/trends/getExchangeRate';
import { Card } from '@/components/shadcn-ui/card';
import ExchangeRate from '@/components/trends/ExchangeRate';
import RisedCoins from '@/components/trends/RisedCoins';
import Situation from '@/components/trends/Situation';
import Topics from '@/components/trends/Topics';
import YoutubeVideos from '@/components/trends/YoutubeVideos';
import PrefetchedRisedCoins from '@/components/trends/PrefetchedRisedCoins';
import ErrorBoundaryAndSuspense from '@/components/shared/ErrorBoundaryAndSuspense';
import PrefetchedTopics from '@/components/trends/PrefetchedTopics';
import PrefetchedYoutubeVideos from '@/components/trends/PrefetchedYoutubeVideos';
import PrefetchedSituation from '@/components/trends/PrefetchedSituation';

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
                        <ErrorBoundaryAndSuspense
                            fallbackTitle="환율 정보를 불러올 수 없습니다"
                            fallbackDesc="잠시 후 다시 시도해주세요.">
                            <ExchangeRate exchangeRates={exchangeRates} />
                        </ErrorBoundaryAndSuspense>
                    </Card>
                </section>

                {/* 상승률 TOP5 */}
                <section className="col-start-1 lg:col-start-2 row-span-2 h-full gap-4">
                    <Card className={CARD_STYLE}>
                        <ErrorBoundaryAndSuspense
                            fallbackTitle="상승률 TOP5 코인을 불러올 수 없습니다"
                            fallbackDesc="잠시 후 다시 시도해주세요.">
                            <PrefetchedRisedCoins>
                                <RisedCoins />
                            </PrefetchedRisedCoins>
                        </ErrorBoundaryAndSuspense>
                    </Card>
                </section>

                {/* 시황 + 토픽 */}
                <section className="col-start-1 grid grid-rows-[auto,1fr] gap-4 h-full">
                    <Card className={CARD_STYLE}>
                        <ErrorBoundaryAndSuspense
                            fallbackTitle="시황을 불러올 수 없습니다"
                            fallbackDesc="잠시 후 다시 시도해주세요.">
                            <PrefetchedSituation>
                                <Situation />
                            </PrefetchedSituation>
                        </ErrorBoundaryAndSuspense>
                    </Card>
                    <Card className={`${CARD_STYLE} h-full`}>
                        <ErrorBoundaryAndSuspense
                            fallbackTitle="토픽 뉴스를 불러올 수 없습니다"
                            fallbackDesc="잠시 후 다시 시도해주세요.">
                            <PrefetchedTopics>
                                <Topics />
                            </PrefetchedTopics>
                        </ErrorBoundaryAndSuspense>
                    </Card>
                </section>

                {/* 유튜브 영상 */}
                <section className="col-start-1 col-span-2 h-full">
                    <Card className={CARD_STYLE}>
                        <ErrorBoundaryAndSuspense
                            fallbackTitle="영상을 불러올 수 없습니다"
                            fallbackDesc="잠시 후 다시 시도해주세요.">
                            <PrefetchedYoutubeVideos>
                                <YoutubeVideos />
                            </PrefetchedYoutubeVideos>
                        </ErrorBoundaryAndSuspense>
                    </Card>
                </section>
            </div>
        </main>
    );
}