"use client";

import React, { useState } from 'react';
import { useUser } from '@/hooks/supabase/useUser';
import { ErrorBoundaryWrapper } from '../shared/ErrorBoundaryWrapper';
import { PortfolioOptionType } from '@/types/portfolio-recommendation/recommendation';
import OptionCard from '@/components/portfolio-recommendation/OptionCard';
import RecommendationResult from './RecommendationResult';

const OPTIONS = [
    {
        key: 'weekly',
        title: '위클리 보스',
        description: '이번 주 가장 상승률이 높은 코인 TOP 5',
        tendency: '상승 흐름이 만들어진 코인으로 중기적인 수익을 기대하는 분에게 추천드려요!',
    },
    {
        key: 'today',
        title: '투데이 스타',
        description: '오늘 매수 체결이 가장 많은 코인 TOP 5',
        tendency: '지금 핫한 코인으로 단기적인 수익을 기대하는 분에게 추천드려요!',
    },
    {
        key: 'giant',
        title: '자이언트',
        description: '원화 마켓 시가총액 TOP 5',
        tendency: '시가총액 기반의 안정적이고 장기적인 수익을 기대하는 분에게 추천드려요!',
    },
];

export default function PortfolioRecommendationClient() {
    const [selectedIdx, setSelectedIdx] = useState(0);

    const { user } = useUser();

    const holdingKRW = user?.holding_krw || 0;
    const minAmount = Math.floor(holdingKRW * 0.5);
    const maxAmount = holdingKRW;

    const handleSelectOption = (idx: number) => setSelectedIdx(idx);

    return (
        <section className="w-full h-full sm:h-[80rem] flex flex-col gap-2">
            <section className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-blue-800">🚀 옵션별 추천 포트폴리오로 쉽게 투자를 시작하세요!</h3>
            </section>

            {/* 옵션 선택 카드 */}
            <section className="flex gap-4 flex-shrink-0">
                {OPTIONS.map((opt, idx) => (
                    <OptionCard
                        key={opt.key}
                        title={opt.title}
                        selected={selectedIdx === idx}
                        onClick={() => handleSelectOption(idx)}
                    />
                ))}
            </section>

            {/* 포트폴리오 추천 결과 */}
            <section className="flex-1 flex">
                <ErrorBoundaryWrapper
                    featureName="포트폴리오 추천"
                    message="포트폴리오 추천 결과를 불러오는 중 오류가 발생했습니다."
                >
                    <RecommendationResult
                        selectedOption={OPTIONS[selectedIdx].key as PortfolioOptionType}
                        title={OPTIONS[selectedIdx].title}
                        description={OPTIONS[selectedIdx].description}
                        tendency={OPTIONS[selectedIdx].tendency}
                        minAmount={minAmount}
                        maxAmount={maxAmount}
                    />
                </ErrorBoundaryWrapper>
            </section>
        </section>
    );
}