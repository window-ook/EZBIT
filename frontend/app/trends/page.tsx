import { Metadata } from 'next';
import { fetchExchangeRate } from '@/lib/trends/fetchExchangeRate';
import { fetchSituationArticles } from '@/lib/trends/fetchSituationArticles';
import { fetchTopicsArticles } from '@/lib/trends/fetchTopicsArticles';
import { fetchYoutubeVideos } from '@/lib/trends/fetchYoutubeVideos';
import { fetchMarkets } from '@/lib/trends/fetchMarkets';
import { fetchTickers } from '@/lib/trends/fetchTickers';
import { formatKSTDate } from '@/utils/shared/date';
import { calculateTopRisedCoins, calculateTradingVolumeTopCoins } from '@/utils/shared/calculateTopCoins';
import ExchangeRate from '@/components/trends/ExchangeRate';
import SituationArticles from '@/components/trends/SituationArticles';
import TopicsArticles from '@/components/trends/TopicsArticles';
import TodayTopRisedCoins from '@/components/trends/TodayTopRisedCoins';
import TodayTopTradingVolumeCoins from '@/components/trends/TodayTopTradingVolumeCoins';
import YoutubeVideos from '@/components/trends/YoutubeVideos';

export const metadata: Metadata = {
    title: '트렌드 : EZBIT',
    description: '코인 최신 트렌드를 확인하세요',
    keywords: ['EZBIT 뉴스', 'EZBIT 트렌드', 'EZBIT 유튜브', 'EZBIT 상승률', 'EZBIT 환율'],
};

let TODAY = new Date().toISOString();
TODAY = formatKSTDate(TODAY);

export default async function TrendsPage() {
    const [exchangeRates, youtubeVideos, markets] = await Promise.all([
        fetchExchangeRate(),
        fetchYoutubeVideos({ keyword: '비트코인', maxResults: '8' }),
        fetchMarkets(),
    ]);
    const tickers = await fetchTickers(markets);
    const situationArticles = await fetchSituationArticles();
    const topicsArticles = await fetchTopicsArticles();

    const krwNames: Record<string, string> = markets.reduce((acc, market) => {
        acc[market.market] = market.korean_name;
        return acc;
    }, {} as Record<string, string>);

    const topRisedCoins = calculateTopRisedCoins(tickers, krwNames);
    const topTradingVolumeCoins = calculateTradingVolumeTopCoins(tickers, krwNames);

    return (
        <main className="contents-container py-4 sm:py-6 px-4 lg:px-0 flex flex-col items-center gap-2">
            <section className="w-full flex flex-col md:flex-row gap-2 items-stretch md:h-[905px]">
                <section className="w-full md:w-4/7 flex flex-col gap-2 md:h-full">
                    <ExchangeRate exchangeRates={exchangeRates} />
                    <SituationArticles articles={situationArticles} />
                    <div className="flex-1 md:min-h-0"><TopicsArticles articles={topicsArticles} /></div>
                </section>

                <section className="w-full md:w-3/7 flex flex-col gap-2 md:h-full">
                    <TodayTopRisedCoins coins={topRisedCoins} currentDate={TODAY} />
                    <TodayTopTradingVolumeCoins coins={topTradingVolumeCoins} currentDate={TODAY} />
                </section>
            </section>

            <section className="w-full flex items-center gap-2">
                <YoutubeVideos videos={youtubeVideos.items} />
            </section>
        </main>
    );
}