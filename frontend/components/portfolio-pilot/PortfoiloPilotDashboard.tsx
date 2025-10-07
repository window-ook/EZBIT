'use client';

import React, { useContext, useMemo, useState, useEffect } from 'react';
import { useTickerBasedTopCoins } from '@/hooks/trends/useTickerBasedTopCoins';
import { useCreateBidWithPortfolioPilot } from '@/hooks/supabase/shared/useCreateBidWithPortfolioPilot';
import { TickerContext } from '@/providers/TickerProvider';
import { calculatePortfolio } from '@/utils/portfolio-pilot/calculatePortfolio';
import { MARKET_CAP_TOP_5 } from '@/constants/portfolioPilot';
import { PortfolioOption, IPilotFilteredItem } from '@/types/portfolio-pilot';
import { ITopCoins } from '@/types/upbit/topCoins';
import { ALERT_MESSAGE } from '@/constants/messages';
import { Card } from '@/components/shadcn-ui/card';
import Button from '@/components/shared/Button';
import Slider from '@/components/shared/Slider';

export interface IPortfolioPilotResult {
    selectedOption: PortfolioOption;
    title: string;
    description: string;
    tendency: string;
    minAmount: number;
    maxAmount: number;
    investmentAmount: number;
    onInvestmentAmountChange: (value: number) => void;
    onPurchaseComplete?: () => void;
}

export default function PortfolioPilotDashboard({
    selectedOption,
    title,
    description,
    tendency,
    minAmount,
    maxAmount,
    investmentAmount,
    onInvestmentAmountChange,
    onPurchaseComplete
}: IPortfolioPilotResult) {
    const { tickers } = useContext(TickerContext);

    const { todayTopRisedCoins, tradingVolumeTopCoins } = useTickerBasedTopCoins();

    const { createPortfolio, isPending } = useCreateBidWithPortfolioPilot();

    const [inputValue, setInputValue] = useState(investmentAmount.toLocaleString());

    useEffect(() => {
        setInputValue(investmentAmount.toLocaleString());
    }, [investmentAmount]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        if (value === '') {
            setInputValue('');
            return;
        }
        const numValue = parseInt(value);
        setInputValue(numValue.toLocaleString());
    };

    const handleInputBlur = () => {
        if (inputValue === '') {
            setInputValue(investmentAmount.toLocaleString());
            return;
        }

        let numValue = parseInt(inputValue.replace(/,/g, ''));
        numValue = Math.max(minAmount, Math.min(maxAmount, Math.round(numValue / 1000) * 1000));
        onInvestmentAmountChange(numValue);
    };

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.currentTarget.blur();
        }
    };

    const handleIncrement = () => {
        const newValue = Math.min(maxAmount, investmentAmount + 10000);
        onInvestmentAmountChange(newValue);
    };

    const handleDecrement = () => {
        const newValue = Math.max(minAmount, investmentAmount - 10000);
        onInvestmentAmountChange(newValue);
    };

    // 시가총액 TOP 5 (실시간 변화율 추가)
    const marketCapTop5Data = useMemo((): ITopCoins[] => {
        return MARKET_CAP_TOP_5.map(coin => {
            const marketCode = `KRW-${coin.code.split('/')[0]}`;
            const ticker = tickers[marketCode];
            const rate = ticker?.signed_change_rate ? ticker.signed_change_rate * 100 : 0;

            return {
                ...coin,
                rate: parseFloat(rate.toFixed(2))
            };
        });
    }, [tickers]);

    // 선택된 옵션에 따른 데이터 선택
    const selectedData = useMemo((): ITopCoins[] => {
        switch (selectedOption) {
            case 'rising-star':
                return todayTopRisedCoins?.slice(0, 5) || [];
            case 'best-seller':
                return tradingVolumeTopCoins?.slice(0, 5) || [];
            case 'giants':
                return marketCapTop5Data.slice(0, 5);
            default:
                return [];
        }
    }, [selectedOption, todayTopRisedCoins, tradingVolumeTopCoins, marketCapTop5Data]);

    // 포트폴리오 계산
    const portfolioResult = useMemo(
        () => calculatePortfolio(selectedData, investmentAmount, tickers, selectedOption),
        [selectedData, investmentAmount, tickers, selectedOption]
    );

    const handlePurchasePortfolio = () => {
        if (portfolioResult.portfolio.length === 0 || portfolioResult.availableCount === 0) return;

        // 매수 가능한 종목들만 필터링하여 주문 데이터 생성
        const orders: IPilotFilteredItem[] = portfolioResult.portfolio
            .filter(item => item.canPurchase)
            .map(item => ({
                market: `KRW-${item.code.split('/')[0]}`,
                volume: item.quantity,
                trade_price: item.currentPrice,
                total_amount: item.allocatedAmount
            }));

        if (orders.length === 0) {
            alert(ALERT_MESSAGE.NO_BIDABLE_MARKETS);
            return;
        }

        createPortfolio(orders);
        onPurchaseComplete?.();
    };

    return (
        <Card
            aria-label='포트폴리오 파일럿 결과'
            className="min-h-0 p-3 sm:p-6 flex-1 flex flex-col gap-3 sm:gap-4 bg-gradient-to-br from-white to-blue-50/30">
            {/* 옵션 정보 */}
            <section className="space-y-2 sm:space-y-3">
                <div className='flex flex-col md:flex-row items-start md:items-end gap-1 sm:gap-2'>
                    <h2 className="text-2xl sm:text-3xl font-bold text-main leading-tight">{title}</h2>
                    <p className="text-sm sm:text-base font-medium text-subtitle">{description}</p>
                </div>
                <div className="px-3 sm:px-4 py-2 sm:py-3 rounded-xl border-l-4 border-r-4 border-main bg-blue-50">
                    <h3 className="text-sm md:text-base text-subtitle font-medium">{tendency}</h3>
                </div>
            </section>

            {/* 투자 금액 설정 */}
            <section className="space-y-3 sm:space-y-4">
                <div className="space-y-2 sm:space-y-3">
                    <dl className="flex justify-between items-center">
                        <dt className="text-sm font-medium text-subtitle">투자 금액</dt>
                        <dd className="flex items-center gap-1 sm:gap-2">
                            <span className="text-lg sm:text-xl font-bold text-main">₩</span>
                            <button
                                type="button"
                                onClick={handleDecrement}
                                disabled={investmentAmount <= minAmount}
                                className="size-7 sm:size-8 flex items-center justify-center rounded-lg bg-main/10 hover:bg-main/20 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
                                aria-label="투자 금액 감소">
                                <span className="text-main text-lg font-bold disabled:text-gray-400">-</span>
                            </button>
                            <input
                                type="text"
                                value={inputValue}
                                onChange={handleInputChange}
                                onBlur={handleInputBlur}
                                onKeyDown={handleInputKeyDown}
                                className="w-32 sm:w-40 text-center text-lg sm:text-xl font-price font-bold text-main bg-transparent border-b-2 border-main/20 focus:border-main focus:outline-none transition-colors"
                                aria-label="투자 금액 직접 입력"
                            />
                            <button
                                type="button"
                                onClick={handleIncrement}
                                disabled={investmentAmount >= maxAmount}
                                className="size-7 sm:size-8 flex items-center justify-center rounded-lg bg-main/10 hover:bg-main/20 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
                                aria-label="투자 금액 증가">
                                <span className="text-main text-lg font-bold disabled:text-gray-400">+</span>
                            </button>
                        </dd>
                    </dl>
                    <Slider
                        aria-label="투자 금액 조정"
                        aria-valuemin={minAmount}
                        aria-valuemax={maxAmount}
                        aria-valuenow={investmentAmount}
                        aria-valuetext={`${investmentAmount.toLocaleString()}원`}
                        min={minAmount}
                        max={maxAmount}
                        step={1000}
                        value={[investmentAmount]}
                        onValueChange={([v]) => onInvestmentAmountChange(v)}
                        className="w-full"
                    />
                    <dl className="flex justify-between text-xs text-description font-price">
                        <dd>{minAmount.toLocaleString()}원</dd>
                        <dd>{maxAmount.toLocaleString()}원</dd>
                    </dl>
                </div>

                <p className="px-2 sm:px-3 py-2 bg-amber-50 rounded-lg shadow-sm text-xs sm:text-sm text-amber-700">투자 가능 범위: 보유 중인 원화의 50% ~ 100%</p>
            </section>

            {/* 포트폴리오 구성 결과 */}
            <section className="space-y-2">
                <h2 className='font-semibold text-base sm:text-lg'>
                    {portfolioResult.portfolio.length === 0 ?
                        '데이터를 불러오는 중...' :
                        `현재 ${portfolioResult.availableCount}/${portfolioResult.portfolio.length} 종목 매수 가능`
                    }
                </h2>
                <p className="text-xs sm:text-sm text-description">
                    • 개별 종목 현재가가 투자 금액의 20%를 초과하면 20% 한도로 제한
                </p>
            </section>

            {/* 포트폴리오 아이템들 */}
            {portfolioResult.portfolio.length > 0 ? (
                <ul role="list" aria-label="포트폴리오 구성" className="space-y-3">
                    {portfolioResult.portfolio.map((item) => (
                        <li
                            key={item.code}
                            className={`bg-white rounded-lg p-3 sm:p-4 border border-gray-100 shadow-sm ${!item.canPurchase ? 'text-description' : ''}`}>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-2 w-full">
                                {/* 종목 정보 */}
                                <div className='flex items-center gap-2 flex-wrap'>
                                    <span className="size-6 sm:size-8 rounded-full flex items-center justify-center text-xs bg-main/10 text-main font-medium">
                                        #{item.rank}
                                    </span>
                                    <span className='font-market-korean font-bold text-base sm:text-lg'>{item.name}</span>
                                    <span className="font-market-code text-gray-500 text-sm">({item.code})</span>
                                    <span className={`text-sm font-semibold font-percentage ${item.rate >= 0 ? 'text-positive' : 'text-negative'}`}>
                                        {item.rate >= 0 ? '+' : ''}{item.rate.toFixed(2)}%
                                    </span>
                                    {item.isPriceExceeded && (<span className="ml-1 text-xs text-amber-600">(20% 제한)</span>)}
                                </div>
                                {/* 매수 정보 */}
                                <div className='flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4'>
                                    {item.canPurchase ? (
                                        <>
                                            <dl className="flex flex-row sm:flex-col gap-1 text-sm min-w-0 sm:min-w-[100px]">
                                                <dt className="font-medium sm:font-normal">매수량:</dt>
                                                <dd className="font-semibold font-price">{item.quantity.toFixed(2)}</dd>
                                            </dl>
                                            <dl className="flex flex-row sm:flex-col gap-1 text-sm min-w-0 sm:min-w-[100px]">
                                                <dt className="font-medium sm:font-normal">실제 투자액:</dt>
                                                <dd className="font-semibold font-price">
                                                    {item.allocatedAmount.toLocaleString()}원
                                                </dd>
                                            </dl>
                                            <dl className="flex flex-row sm:flex-col gap-1 text-sm min-w-0 sm:min-w-[60px]">
                                                <dt className="font-medium sm:font-normal">비중:</dt>
                                                <dd className="font-semibold font-percentage">{item.percentage.toFixed(1)}%</dd>
                                            </dl>
                                        </>
                                    ) : (
                                        <p className="text-sm text-description">
                                            {!item.isKrwMarket ? '원화 마켓 아님' : '매수 불가'}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                // 데이터가 없을 때 더미 아이템들 표시
                Array.from({ length: 5 }).map((_, index) => (
                    <div
                        key={`loading-${index}`}
                        className="bg-white rounded-lg p-3 sm:p-4 border border-gray-100 shadow-sm text-description">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 w-full">
                            {/* 종목 정보 */}
                            <div className='flex items-center gap-2 flex-wrap'>
                                <dl className="size-6 sm:size-8 rounded-full flex items-center justify-center text-xs bg-gray-100 text-gray-400 font-medium">
                                    #{index + 1}
                                </dl>
                                <dl className='font-bold text-base sm:text-lg text-gray-400'>데이터가 아직 없습니다</dl>
                                <dl className="text-gray-300 text-sm">(-/-)</dl>
                                <dl className="text-sm font-medium text-gray-300">--%</dl>
                            </div>
                            {/* 매수 정보 */}
                            <p className="text-sm text-gray-300">
                                데이터 로딩 중
                            </p>
                        </div>
                    </div>
                ))
            )}

            {/* 포트폴리오 요약 */}
            <section className="bg-gradient-to-r from-main/5 to-blue-50 rounded-lg p-3 sm:p-4 border border-main/10 space-y-2">
                <dl className="flex justify-between items-center">
                    <dt className="font-semibold text-base sm:text-lg">실제 투자 금액</dt>
                    <dd className="text-lg sm:text-xl font-price font-bold text-main">{portfolioResult.totalValue.toLocaleString()}원</dd>
                </dl>
                <dl className="flex justify-between items-center text-sm">
                    <dt className="text-slate-600">매수 종목</dt>
                    <dd className="font-medium font-price">{portfolioResult.availableCount}개</dd>
                </dl>
                {portfolioResult.availableCount > 0 && (
                    <dl className="flex justify-between items-center text-sm">
                        <dt className="text-slate-600">종목별 평균 분배 비율</dt>
                        <dd className="font-medium font-percentage">{(100 / portfolioResult.availableCount).toFixed(1)}%</dd>
                    </dl>
                )}
            </section>

            {/* 매수 버튼 */}
            <Button
                ariaLabel='포트폴리오 결과 매수 버튼'
                disabled={isPending || portfolioResult.totalValue === 0 || portfolioResult.availableCount === 0}
                onClick={handlePurchasePortfolio}
                text={isPending ? "매수 진행 중..." : portfolioResult.availableCount === 0 ? "매수 가능한 종목이 없습니다" : "매수하기"}
                customClassName="flex-1 py-3 sm:py-4 text-base sm:text-lg font-semibold bg-gradient-to-r from-main via-main-light to-blue-600 hover:brightness-110 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none disabled:shadow-md"
            />
        </Card>
    );
}