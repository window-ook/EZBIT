import { Metadata } from 'next';
import { getExchangeRate } from '@/actions/trends/getExchangeRate';
import ExchangeRate from '@/components/trends/ExchangeRate';
import RisedCoins from '@/components/trends/RisedCoins';
import Situation from '@/components/trends/Situation';
import Topics from '@/components/trends/Topics';
import YoutubeVideos from '@/components/trends/YoutubeVideos';
import PrefetchRisedCoins from '@/components/trends/PrefetchRisedCoins';
import ErrorBoundaryAndSuspense from '@/components/shared/ErrorBoundaryAndSuspense';
import PrefetchTopics from '@/components/trends/PrefetchTopics';
import PrefetchYoutubeVideos from '@/components/trends/PrefetchYoutubeVideos';

export const metadata: Metadata = {
    title: '트렌드 : EZBIT',
    description: '최신 코인 관련 트렌드 정보를 확인하세요',
    keywords: ['코인', '트렌드', '영상', '상승 코인'],
};

export default async function TrendsPage() {
    const exchangeRates = await getExchangeRate();

    return (
        <main className="py-6 flex flex-col items-center contents-container">
            <div className="w-full grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-6 h-full">
                {/* 환율 */}
                <section className="col-start-1 p-4 rounded-lg bg-gray-100 shadow-sm h-full">
                    <ExchangeRate exchangeRates={exchangeRates!} />
                </section>

                {/* 상승률 TOP5 */}
                <section className="col-start-1 lg:col-start-2 row-span-2 h-full gap-4">
                    <article className="p-4 bg-gray-100 rounded-lg shadow-sm h-full">
                        <ErrorBoundaryAndSuspense
                            fallbackTitle="상승률 TOP5 코인을 불러올 수 없습니다"
                            fallbackDesc="잠시 후 다시 시도해주세요.">
                            <PrefetchRisedCoins>
                                <RisedCoins />
                            </PrefetchRisedCoins>
                        </ErrorBoundaryAndSuspense>
                    </article>
                </section>

                {/* 시황 + 토픽 */}
                <section className="col-start-1 grid grid-rows-[auto,1fr] gap-4 h-full">
                    <article className="p-4 bg-emerald-200 rounded-lg shadow-sm">
                        <ErrorBoundaryAndSuspense
                            fallbackTitle="시황을 불러올 수 없습니다"
                            fallbackDesc="잠시 후 다시 시도해주세요.">
                            <Situation />
                        </ErrorBoundaryAndSuspense>
                    </article>
                    <article className="p-4 bg-gray-100 rounded-lg shadow-sm h-full">
                        <ErrorBoundaryAndSuspense
                            fallbackTitle="토픽 뉴스를 불러올 수 없습니다"
                            fallbackDesc="잠시 후 다시 시도해주세요.">
                            <PrefetchTopics>
                                <Topics />
                            </PrefetchTopics>
                        </ErrorBoundaryAndSuspense>
                    </article>
                </section>

                {/* 유튜브 영상 */}
                <section className="col-start-1 col-span-2 p-4 bg-gray-100 rounded-lg shadow-sm h-full">
                    <ErrorBoundaryAndSuspense
                        fallbackTitle="영상을 불러올 수 없습니다"
                        fallbackDesc="잠시 후 다시 시도해주세요.">
                        <PrefetchYoutubeVideos>
                            <YoutubeVideos />
                        </PrefetchYoutubeVideos>
                    </ErrorBoundaryAndSuspense>
                </section>
            </div>
        </main>
    );
}