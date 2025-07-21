'use client';

import { useContext, useMemo, useState } from 'react';
import { useWeeklyTopRisedCoins } from '@/hooks/trends/useWeeklyTopRisedCoins';
import { useDailyTopBidCoins } from '@/hooks/trends/useDailyTopBidCoins';
import { useMarketCapTopCoins } from '@/hooks/trends/useMarketCapTopCoins';
import { TickerContext } from '@/providers/TickerProvider';
import { useCreatePortfolioBid } from '@/hooks/supabase/useCreatePortfolioBid';
import { PortfolioOptionType, IPortfolioItem, IPortfolioResult, IPortfolioBidItem } from '@/types/portfolio-recommendation/recommendation';
import { ITopCoins } from '@/types/upbit/topCoins';
import { Card } from '@/components/shadcn-ui/card';
import Button from '@/components/shared/Button';
import Slider from '@/components/shared/Slider';

interface IRecommendationResult {
    selectedOption: PortfolioOptionType;
    title: string;
    description: string;
    tendency: string;
    minAmount: number;
    maxAmount: number;
    onPurchaseComplete?: () => void;
}

export default function RecommendationResult({
    selectedOption,
    title,
    description,
    tendency,
    minAmount,
    maxAmount,
    onPurchaseComplete
}: IRecommendationResult) {
    const { tickers } = useContext(TickerContext);

    const [investmentAmount, setInvestmentAmount] = useState(minAmount);

    // 포트폴리오 매수 훅 사용
    const { createPortfolio, isPending } = useCreatePortfolioBid();

    // 선택된 옵션에 따라 적절한 훅 사용
    const { weeklyTopCoins } = useWeeklyTopRisedCoins();
    const { dailyBidData } = useDailyTopBidCoins();
    const { marketCapTop10Data } = useMarketCapTopCoins();

    // 선택된 옵션에 따른 데이터 선택
    const selectedData = useMemo((): ITopCoins[] => {
        switch (selectedOption) {
            case 'weekly':
                return weeklyTopCoins?.slice(0, 5) || [];
            case 'today':
                return dailyBidData?.slice(0, 5) || [];
            case 'giant':
                return marketCapTop10Data?.slice(0, 5) || [];
            default:
                return [];
        }
    }, [selectedOption, weeklyTopCoins, dailyBidData, marketCapTop10Data]);

    // 포트폴리오 계산
    const portfolioResult = useMemo((): IPortfolioResult => {
        if (selectedData.length === 0) {
            return {
                selectedOption,
                totalAmount: investmentAmount,
                portfolio: [],
                totalValue: 0,
                availableCount: 0
            };
        }

        // 1. 매수 가능한 종목 필터링
        const availableCoins = selectedData.filter((coin) => {
            // KRW 마켓 체크
            const isKrwMarket = coin.code.includes('/KRW');
            if (!isKrwMarket) return false;

            // 현재가가 투자금액의 20%를 초과하는지 체크
            const marketCode = `KRW-${coin.code.split('/')[0]}`;
            const currentPrice = tickers[marketCode]?.trade_price ?? 0;
            const maxPricePerCoin = Math.floor(investmentAmount / 5); // 기본 20% 기준

            return currentPrice > 0 && currentPrice <= maxPricePerCoin;
        });

        // 2. 매수 가능한 종목 수에 따라 동적 금액 분배
        const availableCount = availableCoins.length;
        const targetAmountPerCoin = availableCount > 0 ? Math.floor(investmentAmount / availableCount) : 0;
        const percentagePerCoin = availableCount > 0 ? Math.round((100 / availableCount) * 100) / 100 : 0;

        // 3. 전체 포트폴리오 생성 (매수 가능/불가능 종목 모두 포함)
        const portfolio: IPortfolioItem[] = selectedData.map((coin) => {
            const marketCode = `KRW-${coin.code.split('/')[0]}`;
            const currentPrice = tickers[marketCode]?.trade_price ?? 0;
            const isKrwMarket = coin.code.includes('/KRW');
            const maxPricePerCoin = Math.floor(investmentAmount / 5);
            const canPurchase = isKrwMarket && currentPrice > 0 && currentPrice <= maxPricePerCoin;

            // 매수 가능한 종목만 실제 계산
            const quantity = canPurchase ? (targetAmountPerCoin / currentPrice) : 0;
            const actualAmount = canPurchase ? targetAmountPerCoin : 0;

            return {
                code: coin.code,
                name: coin.name,
                rank: coin.rank,
                rate: coin.rate,
                allocatedAmount: actualAmount,
                currentPrice,
                quantity,
                percentage: canPurchase ? percentagePerCoin : 0,
                canPurchase, // 매수 가능 여부 추가
                isKrwMarket, // KRW 마켓 여부 추가
                isPriceExceeded: currentPrice > maxPricePerCoin // 가격 초과 여부 추가
            };
        });

        const totalValue = portfolio.reduce((sum, item) => sum + item.allocatedAmount, 0);

        return {
            selectedOption,
            totalAmount: investmentAmount,
            portfolio,
            totalValue,
            availableCount // 매수 가능한 종목 수 추가
        };
    }, [selectedData, investmentAmount, tickers, selectedOption]);

    const handlePurchasePortfolio = () => {
        if (portfolioResult.portfolio.length === 0 || portfolioResult.availableCount === 0) return;

        // 매수 가능한 종목들만 필터링하여 주문 데이터 생성
        const orders: IPortfolioBidItem[] = portfolioResult.portfolio
            .filter(item => item.canPurchase)
            .map(item => ({
                market: `KRW-${item.code.split('/')[0]}`,
                volume: item.quantity,
                trade_price: item.currentPrice,
                total_amount: item.allocatedAmount
            }));

        if (orders.length === 0) {
            alert('매수 가능한 종목이 없습니다.');
            return;
        }

        // 포트폴리오 매수 실행 (낙관적 업데이트 포함)
        createPortfolio(orders);

        // 매수 완료 후 콜백 실행
        onPurchaseComplete?.();
    };

    return (
        <Card className="flex-1 flex flex-col gap-6 p-6 bg-gradient-to-br from-white to-blue-50/30 min-h-0">
            {/* 옵션 정보 섹션 */}
            <div className="space-y-3">
                <div className='flex flex-col gap-1'>
                    <span className="text-3xl font-bold text-main leading-tight">{title}</span>
                    <span className="text-base font-medium text-subtitle">{description}</span>
                </div>
                <div className="px-4 py-3 bg-blue-50 rounded-xl border-l-4 border-main">
                    <span className="text-gray-700 font-medium">{tendency}</span>
                </div>
            </div>

            {/* 투자 금액 설정 섹션 */}
            <div className="space-y-4">
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-subtitle">투자 금액</span>
                        <span className="text-2xl font-bold text-main">{investmentAmount.toLocaleString()}원</span>
                    </div>
                    <Slider
                        min={minAmount}
                        max={maxAmount}
                        step={1000}
                        value={[investmentAmount]}
                        onValueChange={([v]) => setInvestmentAmount(v)}
                        className="w-full"
                    />
                    <div className="flex justify-between text-xs text-description">
                        <span>{minAmount.toLocaleString()}원</span>
                        <span>{maxAmount.toLocaleString()}원</span>
                    </div>
                </div>

                <div className="px-3 py-2 bg-amber-50 rounded-lg shadow-sm">
                    <span className='text-sm text-amber-700'>매수 가능 범위: 보유 중인 원화의 50% ~ 100%</span>
                </div>
            </div>

            {/* 포트폴리오 결과 섹션 */}
            <div className="space-y-2">
                <h2 className='font-semibold text-lg'>
                    포트폴리오 구성 ({portfolioResult.availableCount}/{portfolioResult.portfolio.length} 종목 매수 가능)
                </h2>
                <div className="text-sm text-description">
                    • 원화 마켓만 매수 가능
                    • 개별 종목 현재가가 설정 금액의 20%를 초과하면 매수 불가
                    • 매수 가능한 종목 수에 따라 동적 분배
                </div>
            </div>
            {portfolioResult.portfolio.map((item) => (
                <div
                    key={item.code}
                    className={`bg-white rounded-lg p-4 border border-gray-100 shadow-sm ${!item.canPurchase ? 'text-description' : ''}`}>
                    <div className="flex items-center justify-between gap-2 w-full">
                        {/* 종목 정보 */}
                        <div className='flex items-center gap-2'>
                            <span className="size-8 rounded-full flex items-center justify-center text-xs bg-main/10 text-main font-medium">
                                #{item.rank}
                            </span>
                            <span className='font-bold text-lg'>{item.name}</span>
                            <span className="text-gray-500 text-sm">({item.code})</span>
                            <span className={`text-sm font-medium ${item.rate >= 0 ? 'text-positive' : 'text-negative'}`}>
                                {item.rate >= 0 ? '+' : ''}{item.rate.toFixed(2)}%
                            </span>
                        </div>
                        {/* 매수 정보 */}
                        <div className='flex items-center gap-4'>
                            {item.canPurchase ? (
                                <>
                                    <div className="flex flex-col gap-1 text-sm min-w-[100px]">
                                        <span>매수량</span>
                                        <span className="font-semibold">{item.quantity.toFixed(2)}</span>
                                    </div>
                                    <div className="flex flex-col gap-1 text-sm min-w-[100px]">
                                        <span>실제 투자액</span>
                                        <span className="font-semibold">{item.allocatedAmount.toLocaleString()}원</span>
                                    </div>
                                    <div className="flex flex-col gap-1 text-sm min-w-[60px]">
                                        <span>비중</span>
                                        <span className="font-semibold">{item.percentage.toFixed(1)}%</span>
                                    </div>
                                </>
                            ) : (
                                <div className="text-sm text-description">
                                    {!item.isKrwMarket ? '원화 마켓 아님' :
                                        item.isPriceExceeded ? '보유 원화의 20% 초과' : '매수 불가'}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}

            {/* 포트폴리오 요약 */}
            <div className="bg-gradient-to-r from-main/5 to-blue-50 rounded-lg p-4 border border-main/10 space-y-2">
                <div className="flex justify-between items-center">
                    <span className="font-semibold text-lg">투자 금액</span>
                    <span className="text-xl font-bold text-main">{portfolioResult.totalValue.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-600">매수 가능 종목</span>
                    <span className="font-medium">{portfolioResult.availableCount}/{portfolioResult.portfolio.length}개</span>
                </div>
                {portfolioResult.availableCount > 0 && (
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-600">종목별 평균 분배 비율</span>
                        <span className="font-medium">{(100 / portfolioResult.availableCount).toFixed(1)}%</span>
                    </div>
                )}
            </div>

            {/* 매수 버튼 */}
            <Button
                text={isPending ? "매수 진행 중..." :
                    portfolioResult.availableCount === 0 ? "매수 가능한 종목이 없습니다" :
                        "포트폴리오 매수하기"}
                disabled={isPending || portfolioResult.totalValue === 0 || portfolioResult.availableCount === 0}
                onClick={handlePurchasePortfolio}
                customClassName="flex-1 py-4 text-lg font-semibold bg-gradient-to-r from-main to-blue-600 hover:from-blue-600 hover:to-main transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none disabled:shadow-md"
            />
        </Card>
    );
}