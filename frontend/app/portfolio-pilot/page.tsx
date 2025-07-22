import { Metadata } from 'next';
import PortfolioPilotClient from '@/components/portfolio-pilot/PortfolioPilotClient';
import PrefetchedUserData from '@/components/shared/PrefetchedUserData';

export const metadata: Metadata = {
    title: '포트폴리오 파일럿 : EZBIT',
    description: '포트폴리오 파일럿 페이지입니다.',
    keywords: ['포트폴리오', '추천', 'EZBIT', '투자', '손익', '수익률'],
};

export const dynamic = 'force-dynamic';

export default function PortfolioRecommendationPage() {
    return (
        <main>
            <PrefetchedUserData>
                <PortfolioPilotClient />
            </PrefetchedUserData>
        </main>
    );
}