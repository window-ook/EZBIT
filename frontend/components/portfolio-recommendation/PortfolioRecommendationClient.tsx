"use client";

import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { userQuery } from '@/queries/supabase/user.query';
import { ISupabaseUser } from '@/types/supabase/user';
// import { useUser } from '@/hooks/supabase/useUser';
// import { dailyTopBidCoinsQuery } from '@/queries/trends/dailyTopBidCoins.query';
// import { weeklyTopRisedCoinsQuery } from '@/queries/trends/weeklyTopRisedCoins.query';
// import { marketCapTopCoinsQuery } from '@/queries/trends/marketCapTopCoins.query';
import OptionCard from '@/components/portfolio-recommendation/OptionCard';
import OptionDetail from '@/components/portfolio-recommendation/OptionDetail';
import RecommendationResult from './RecommendationResult';

const OPTIONS = [
    {
        key: 'weekly',
        title: '위클리 보스',
        description: '이번 주 가장 상승률이 높은 코인 TOP 5',
        tendency: '상승 흐름이 만들어진 코인으로 수익을 기대하고 싶으신 분에게 추천드려요!',
    },
    {
        key: 'today',
        title: '투데이 스타',
        description: '오늘 매수 체결이 가장 많은 코인 TOP 5',
        tendency: '당장 핫한 코인으로 단기적인 수익을 기대하고 싶으신 분에게 추천드려요!',
    },
    {
        key: 'giant',
        title: '자이언트',
        description: '원화 마켓 시가총액 TOP 5',
        tendency: '시가총액이 큰 코인으로 안정적인 투자를 하고 싶으신 분에게 추천드려요!',
    },
];

export default function PortfolioRecommendationClient() {
    const queryClient = useQueryClient();

    const [selectedIdx, setSelectedIdx] = useState(0);
    const [amount, setAmount] = useState(0);

    const user = queryClient.getQueryData<ISupabaseUser>(userQuery.all());

    // 보유 KRW(최대 매수 가능 금액)
    const holdingKRW = user?.holding_krw || 0;

    // 금액 선택 범위: 50% ~ 100%
    const minAmount = Math.floor(holdingKRW * 0.5);
    const maxAmount = holdingKRW;

    // 옵션 변경 시 금액도 초기화
    const handleSelectOption = (idx: number) => {
        setSelectedIdx(idx);
        setAmount(minAmount);
    };

    // 매수 버튼 클릭 핸들러(추후 실제 매수 로직 연결)
    const handleBid = () => {
        alert(`${OPTIONS[selectedIdx].title} 포트폴리오 매수 체결`);
        setSelectedIdx(0);
        setAmount(0);
    };

    return (
        <section className="size-full flex flex-col gap-6">
            {/* 옵션 선택 카드 */}
            <section className="flex gap-4">
                {OPTIONS.map((opt, idx) => (
                    <OptionCard
                        key={opt.key}
                        title={opt.title}
                        selected={selectedIdx === idx}
                        onClick={() => handleSelectOption(idx)}
                    />
                ))}
            </section>
            {/* 옵션 상세 정보 */}
            <OptionDetail
                title={OPTIONS[selectedIdx].title}
                description={OPTIONS[selectedIdx].description}
                tendency={OPTIONS[selectedIdx].tendency}
                amount={amount}
                minAmount={minAmount}
                maxAmount={maxAmount}
                onAmountChange={setAmount}
                onBuy={handleBid}
            />
            {/* 포트폴리오 자동 구성 결과 */}
            <RecommendationResult />
        </section>
    );
} 