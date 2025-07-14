import { Metadata } from 'next';

export const metadata: Metadata = {
    title: '포트폴리오 추천 : EZBIT',
    description: '포트폴리오 추천 페이지입니다.',
    keywords: ['포트폴리오', '추천', 'EZBIT', '투자', '손익', '수익률'],
};

export default function AutoPortfolioPage() {
    return (
        <h1>포트폴리오 추천 페이지</h1>
    );
}