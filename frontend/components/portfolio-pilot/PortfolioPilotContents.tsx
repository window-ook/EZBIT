'use client';

import React, { useState } from 'react';
import { PORTFOLIO_OPTIONS } from '@/constants/portfolioPilot';
import PortfolioPilotOptionButton from '@/components/portfolio-pilot/PortfolioPilotOptionButton';
import PortfolioPilotDashboard from '@/components/portfolio-pilot/PortfoiloPilotDashboard';

export interface IPortfolioPilotClient {
    holdingKRW: number;
}

export default function PortfolioPilotContents({ holdingKRW }: IPortfolioPilotClient) {
    const [selectedIdx, setSelectedIdx] = useState(0);
    const [investmentAmount, setInvestmentAmount] = useState(Math.floor(holdingKRW * 0.5));

    const minAmount = Math.floor(holdingKRW * 0.5);
    const maxAmount = holdingKRW;

    const handleSelectOption = (idx: number) => setSelectedIdx(idx);

    return (
        <>
            <section className="flex gap-4 flex-shrink-0">
                {PORTFOLIO_OPTIONS.map((opt, idx) => (
                    <PortfolioPilotOptionButton
                        key={opt.key}
                        title={opt.title}
                        selected={selectedIdx === idx}
                        onClick={() => handleSelectOption(idx)}
                    />
                ))}
            </section>

            <section className="flex-1 flex">
                <PortfolioPilotDashboard
                    selectedOption={PORTFOLIO_OPTIONS[selectedIdx].key}
                    title={PORTFOLIO_OPTIONS[selectedIdx].title}
                    description={PORTFOLIO_OPTIONS[selectedIdx].description}
                    tendency={PORTFOLIO_OPTIONS[selectedIdx].tendency}
                    minAmount={minAmount}
                    maxAmount={maxAmount}
                    investmentAmount={investmentAmount}
                    onInvestmentAmountChange={setInvestmentAmount}
                />
            </section>
        </>
    );
}