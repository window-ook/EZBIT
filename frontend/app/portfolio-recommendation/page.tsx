import { Metadata } from 'next';
import PortfolioRecommendationClient from '@/components/portfolio-recommendation/PortfolioRecommendationClient';
import PrefetchedWeeklyTopRisedCoins from '@/components/trends/prefetched/PrefetchedWeeklyTopRisedCoins';
import PrefetchedDailyTopBidCoins from '@/components/trends/prefetched/PrefetchedDailyTopBidCoins';
import PrefetchedMarketCapTopCoins from '@/components/trends/prefetched/PrefetchedMarketCapTopCoins';
import PrefetchedUserAndHoldings from '@/components/shared/PrefetchedUserAndHoldings';

export const metadata: Metadata = {
    title: '포트폴리오 추천 : EZBIT',
    description: '포트폴리오 추천 페이지입니다.',
    keywords: ['포트폴리오', '추천', 'EZBIT', '투자', '손익', '수익률'],
};

export default function PortfolioRecommendationPage() {
    return (
        <main>
            <PrefetchedUserAndHoldings>
                <PrefetchedWeeklyTopRisedCoins>
                    <PrefetchedDailyTopBidCoins>
                        <PrefetchedMarketCapTopCoins>
                            <PortfolioRecommendationClient />
                        </PrefetchedMarketCapTopCoins>
                    </PrefetchedDailyTopBidCoins>
                </PrefetchedWeeklyTopRisedCoins>
            </PrefetchedUserAndHoldings>
        </main>
    );
}