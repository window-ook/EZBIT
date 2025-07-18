'use client';

import { useContext, useMemo, useState } from 'react';
import { useWeeklyTopRisedCoins } from '@/hooks/trends/useWeeklyTopRisedCoins';
import { useDailyTopBidCoins } from '@/hooks/trends/useDailyTopBidCoins';
import { useMarketCapTopCoins } from '@/hooks/trends/useMarketCapTopCoins';
import { TickerContext } from '@/providers/TickerProvider';
import { PortfolioOptionType, IPortfolioItem, IPortfolioResult } from '@/types/portfolio/recommendation';
import { ITopCoins } from '@/types/upbit/topCoins';
import { Card } from '@/components/shadcn-ui/card';
import Button from '@/components/shared/Button';
import Slider from '@/components/shared/Slider';

interface RecommendationResultProps {
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
}: RecommendationResultProps) {
    const { tickers } = useContext(TickerContext);

    const [isPurchasing, setIsPurchasing] = useState(false);
    const [investmentAmount, setInvestmentAmount] = useState(minAmount);

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
                totalValue: 0
            };
        }

        const targetAmountPerCoin = Math.floor(investmentAmount / 5); // 20%씩 분할
        const portfolio: IPortfolioItem[] = selectedData.map((coin) => {
            const marketCode = `KRW-${coin.code}`;
            const currentPrice = tickers[marketCode]?.trade_price ?? 0;
            const quantity = currentPrice > 0 ? Math.floor(targetAmountPerCoin / currentPrice) : 0;
            const actualAmount = quantity * currentPrice;

            return {
                code: coin.code,
                name: coin.name,
                rank: coin.rank,
                rate: coin.rate,
                allocatedAmount: actualAmount, // 실제 투자액으로 변경
                currentPrice,
                quantity,
                percentage: 20 // 각각 20%
            };
        });

        const totalValue = portfolio.reduce((sum, item) => sum + (item.quantity * item.currentPrice), 0);

        return {
            selectedOption,
            totalAmount: investmentAmount,
            portfolio,
            totalValue
        };
    }, [selectedData, investmentAmount, tickers, selectedOption]);

    const handlePurchasePortfolio = async () => {
        if (portfolioResult.portfolio.length === 0) return;

        setIsPurchasing(true);
        try {
            // TODO: 실제 매수 로직 구현
            // portfolioResult.portfolio.forEach(item => {
            //     // 각 코인별로 매수 주문 실행
            // });

            await new Promise(resolve => setTimeout(resolve, 2000)); // 임시 딜레이

            alert('포트폴리오 매수가 완료되었습니다!');
            onPurchaseComplete?.();
        } catch (error) {
            console.error('매수 실패:', error);
            alert('매수 중 오류가 발생했습니다.');
        } finally {
            setIsPurchasing(false);
        }
    };

    return (
        <Card className="flex-1 flex flex-col gap-6 p-6 bg-gradient-to-br from-white to-blue-50/30">
            {/* 옵션 정보 섹션 */}
            <div className="space-y-3">
                <div className='flex flex-col gap-1'>
                    <span className="text-3xl font-bold text-main leading-tight">{title}</span>
                    <span className="text-base font-medium text-gray-500">{description}</span>
                </div>
                <div className="px-4 py-3 bg-blue-50 rounded-xl border-l-4 border-main">
                    <span className="text-gray-700 font-medium">{tendency}</span>
                </div>
            </div>

            {/* 투자 금액 설정 섹션 */}
            <div className="space-y-4">
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-600">투자 금액</span>
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
                    <div className="flex justify-between text-xs text-gray-500">
                        <span>{minAmount.toLocaleString()}원</span>
                        <span>{maxAmount.toLocaleString()}원</span>
                    </div>
                </div>

                <div className="px-3 py-2 bg-amber-50 rounded-lg">
                    <span className='text-sm text-amber-700'>매수 가능 범위: 보유 중인 원화의 50% ~ 100%</span>
                </div>
            </div>

            {/* 포트폴리오 결과 섹션 */}
            <h2 className='text-subtitle font-semibold text-lg'>각 종목별 20%씩 구성</h2>
            {portfolioResult.portfolio.map((item) => (
                <div key={item.code} className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between gap-2 w-full">
                        {/* 종목 정보 */}
                        <div className='flex items-center gap-2'>
                            <span className="size-8 rounded-full flex items-center justify-center text-xs bg-main/10 text-main font-medium">
                                #{item.rank}
                            </span>
                            <span className="font-bold text-lg">{item.name}</span>
                            <span className="text-gray-500 text-sm">({item.code})</span>
                            <span className={`text-sm font-medium ${item.rate >= 0 ? 'text-positive' : 'text-negative'}`}>
                                {item.rate >= 0 ? '+' : ''}{item.rate.toFixed(2)}%
                            </span>
                        </div>
                        {/* 매수 정보 */}
                        <div className='flex items-center gap-2'>
                            <div className="flex gap-1">
                                <span className="text-gray-600">매수량</span>
                                <span className="font-semibold">{item.quantity.toLocaleString()}개</span>
                            </div>
                            <div className="flex gap-1">
                                <span className="text-gray-600">실제 투자액</span>
                                <span className="font-semibold">{(item.quantity * item.currentPrice).toLocaleString()}원</span>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {/* 포트폴리오 요약 */}
            <div className="bg-gradient-to-r from-main/5 to-blue-50 rounded-lg p-4 border border-main/10">
                <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-700">실제 포트폴리오 가치</span>
                    <span className="text-xl font-bold text-main">{portfolioResult.totalValue.toLocaleString()}원</span>
                </div>
                {portfolioResult.totalValue !== investmentAmount && (
                    <div className="text-xs text-gray-600 mt-2">
                        * 소수점 이하 매수 불가로 인한 차액: {(investmentAmount - portfolioResult.totalValue).toLocaleString()}원
                    </div>
                )}
            </div>

            {/* 매수 버튼 */}
            <Button
                text={isPurchasing ? "매수 진행 중..." : "포트폴리오 매수하기"}
                disabled={isPurchasing || portfolioResult.totalValue === 0}
                onClick={handlePurchasePortfolio}
                customClassName="flex-1 py-4 text-lg font-semibold bg-gradient-to-r from-main to-blue-600 hover:from-blue-600 hover:to-main transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none disabled:shadow-md"
            />
        </Card>
    );
}