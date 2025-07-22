"use client";

import React, { useState, Suspense } from 'react';
import { useUserData } from '@/hooks/supabase/useUserData';
import { ErrorBoundaryWrapper } from '@/components/shared/ErrorBoundaryWrapper';
import { PortfolioOption } from '@/types/portfolio-pilot/portfolioPilot';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import OptionCard from '@/components/portfolio-pilot/OptionCard';
import PortfolioPilotResult from '@/components/portfolio-pilot/PortfoiloPilotResult';

const OPTIONS = [
    {
        key: 'rate',
        title: '라이징 스타',
        description: '실시간 상승률이 높은 코인 TOP 5',
        tendency: '지금 가장 핫한 코인으로 단기적인 수익을 기대하는 분에게 추천드려요!',
    },
    {
        key: 'volume',
        title: '베스트 셀러',
        description: '24시간 거래대금이 가장 높은 코인 TOP 5',
        tendency: '활발한 거래가 이루어지는 인기 코인으로 단기적인 수익을 원하는 분에게 추천드려요!',
    },
    {
        key: 'giant',
        title: '자이언트',
        description: '시가총액이 가장 높은 코인 TOP 5',
        tendency: '시가총액 기반의 안정적이고 안정적 & 장기적인 수익을 기대하는 분에게 추천드려요!',
    },
];

export default function PortfolioPilotClient() {
    const [selectedIdx, setSelectedIdx] = useState(0);

    const { user } = useUserData();

    const holdingKRW = user?.holding_krw || 0;
    const minAmount = Math.floor(holdingKRW * 0.5);
    const maxAmount = holdingKRW;

    const handleSelectOption = (idx: number) => setSelectedIdx(idx);

    return (
        <section className="w-full h-full sm:h-[80rem] flex flex-col gap-2">
            <section className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
                <h3 className="text-sm font-semibold text-blue-800">🚀 포트폴리오 파일럿이 선택한 옵션으로 포트폴리오를 만들어드립니다!</h3>
            </section>

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

            <section className="flex-1 flex">
                <ErrorBoundaryWrapper
                    featureName="포트폴리오 파일럿"
                    message="포트폴리오 파일럿을 불러오는 중 오류가 발생했습니다."
                >
                    <Suspense fallback={<LoadingSpinner size='2xl' />}>
                        <PortfolioPilotResult
                            selectedOption={OPTIONS[selectedIdx].key as PortfolioOption}
                            title={OPTIONS[selectedIdx].title}
                            description={OPTIONS[selectedIdx].description}
                            tendency={OPTIONS[selectedIdx].tendency}
                            minAmount={minAmount}
                            maxAmount={maxAmount}
                        />
                    </Suspense>
                </ErrorBoundaryWrapper>
            </section>
        </section>
    );
}