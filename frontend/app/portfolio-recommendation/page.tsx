import { Metadata } from 'next';
import PortfolioRecommendationClient from '@/components/portfolio-recommendation/PortfolioRecommendationClient';
import PrefetchedUserData from '@/components/shared/PrefetchedUserData';

export const metadata: Metadata = {
    title: '포트폴리오 추천 : EZBIT',
    description: '포트폴리오 추천 페이지입니다.',
    keywords: ['포트폴리오', '추천', 'EZBIT', '투자', '손익', '수익률'],
};

export default function PortfolioRecommendationPage() {
    return (
        <main>
            {/* ✅ 단일 컴포넌트로 모든 데이터 병렬 로딩 */}
            <PrefetchedUserData includePortfolioData={true}>
                <PortfolioRecommendationClient />
            </PrefetchedUserData>
        </main>
    );
}