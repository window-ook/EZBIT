import { Metadata } from 'next';

export const metadata: Metadata = {
    title: '포트폴리오 추천 결과 : EZBIT',
    description: '포트폴리오 추천 결과를 확인하세요',
    keywords: ['포트폴리오', '추천', 'EZBIT', '투자', '손익', '수익률'],
};

export default function AutoPortfolioResultPage() {
    return (
        <h1>포트폴리오 추천 결과 페이지</h1>
    );
}