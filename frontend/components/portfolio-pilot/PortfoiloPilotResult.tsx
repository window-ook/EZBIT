'use client';

import { useContext, useMemo, useState } from 'react';
import { useTickerBasedTopCoins } from '@/hooks/trends/useTickerBasedTopCoins';
import { useCreateBidWithPortfolioPilot } from '@/hooks/supabase/shared/useCreateBidWithPortfolioPilot';
import { TickerContext } from '@/providers/TickerProvider';
import { PortfolioOption, IPilotItem, IPilotResult, IPilotFilteredItem } from '@/types/portfolio-pilot/portfolioPilot';
import { ITopCoins } from '@/types/upbit/topCoins';
import { Card } from '@/components/shadcn-ui/card';
import Button from '@/components/shared/Button';
import Slider from '@/components/shared/Slider';

/** 시가총액 TOP 5 */
const MARKET_CAP_TOP_5: Omit<ITopCoins, 'rate'>[] = [
    { rank: 1, name: '비트코인', code: 'BTC/KRW' },
    { rank: 2, name: '이더리움', code: 'ETH/KRW' },
    { rank: 3, name: '리플', code: 'XRP/KRW' },
    { rank: 4, name: '솔라나', code: 'SOL/KRW' },
    { rank: 5, name: '에이다', code: 'ADA/KRW' },
];

interface IPortfolioPilotResult {
    selectedOption: PortfolioOption;
    title: string;
    description: string;
    tendency: string;
    minAmount: number;
    maxAmount: number;
    onPurchaseComplete?: () => void;
}

export default function PortfolioPilotResult({
    selectedOption,
    title,
    description,
    tendency,
    minAmount,
    maxAmount,
    onPurchaseComplete
}: IPortfolioPilotResult) {
    const { tickers } = useContext(TickerContext);

    const [investmentAmount, setInvestmentAmount] = useState(minAmount);

    // 포트폴리오 매수 훅 사용
    const { createPortfolio, isPending } = useCreateBidWithPortfolioPilot();

    // TickerProvider 기반 실시간 TOP 코인 데이터
    const { todayTopRisedCoins, tradingVolumeTopCoins } = useTickerBasedTopCoins();

    // 시가총액 TOP 5 실시간 계산
    const marketCapTop5Data = useMemo((): ITopCoins[] => {
        return MARKET_CAP_TOP_5.map(coin => {
            // BTC/KRW → KRW-BTC 형태로 변환
            const marketCode = `KRW-${coin.code.split('/')[0]}`;
            const ticker = tickers[marketCode];

            // 실시간 변화율 가져오기 (%)
            const rate = ticker?.signed_change_rate ? ticker.signed_change_rate * 100 : 0;

            return {
                ...coin,
                rate: parseFloat(rate.toFixed(2)) // 소수점 2자리로 제한
            };
        });
    }, [tickers]);

    // 선택된 옵션에 따른 데이터 선택
    const selectedData = useMemo((): ITopCoins[] => {
        switch (selectedOption) {
            case 'rate':
                return todayTopRisedCoins?.slice(0, 5) || [];
            case 'volume':
                return tradingVolumeTopCoins?.slice(0, 5) || [];
            case 'giant':
                return marketCapTop5Data.slice(0, 5); // 직접 계산된 시가총액 데이터
            default:
                return [];
        }
    }, [selectedOption, todayTopRisedCoins, tradingVolumeTopCoins, marketCapTop5Data]);

    // 포트폴리오 계산
    const portfolioResult = useMemo((): IPilotResult => {
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
        const portfolio: IPilotItem[] = selectedData.map((coin) => {
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
        const orders: IPilotFilteredItem[] = portfolioResult.portfolio
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
                        <dd className="text-xl sm:text-2xl font-bold text-main">{investmentAmount.toLocaleString()}원</dd>
                    </dl>
                    <Slider
                        min={minAmount}
                        max={maxAmount}
                        step={1000}
                        value={[investmentAmount]}
                        onValueChange={([v]) => setInvestmentAmount(v)}
                        className="w-full"
                    />
                    <dl className="flex justify-between text-xs text-description">
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
                    • 개별 종목 현재가가 투자 금액의 20%를 초과하면 매수 불가<br className="sm:hidden" />
                    • 매수 가능한 종목 수에 따라 동적 분배
                </p>
            </section>

            {/* 포트폴리오 아이템들 */}
            {portfolioResult.portfolio.length > 0 ? (
                portfolioResult.portfolio.map((item) => (
                    <div
                        key={item.code}
                        className={`bg-white rounded-lg p-3 sm:p-4 border border-gray-100 shadow-sm ${!item.canPurchase ? 'text-description' : ''}`}>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-2 w-full">
                            {/* 종목 정보 */}
                            <div className='flex items-center gap-2 flex-wrap'>
                                <dl className="size-6 sm:size-8 rounded-full flex items-center justify-center text-xs bg-main/10 text-main font-medium">
                                    #{item.rank}
                                </dl>
                                <dl className='font-bold text-base sm:text-lg'>{item.name}</dl>
                                <dl className="text-gray-500 text-sm">({item.code})</dl>
                                <dl className={`text-sm font-medium ${item.rate >= 0 ? 'text-positive' : 'text-negative'}`}>
                                    {item.rate >= 0 ? '+' : ''}{item.rate.toFixed(2)}%
                                </dl>
                            </div>
                            {/* 매수 정보 */}
                            <div className='flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4'>
                                {item.canPurchase ? (
                                    <>
                                        <dl className="flex flex-row sm:flex-col gap-1 text-sm min-w-0 sm:min-w-[100px]">
                                            <dt className="font-medium sm:font-normal">매수량:</dt>
                                            <dd className="font-semibold">{item.quantity.toFixed(2)}</dd>
                                        </dl>
                                        <dl className="flex flex-row sm:flex-col gap-1 text-sm min-w-0 sm:min-w-[100px]">
                                            <dt className="font-medium sm:font-normal">실제 투자액:</dt>
                                            <dd className="font-semibold">{item.allocatedAmount.toLocaleString()}원</dd>
                                        </dl>
                                        <dl className="flex flex-row sm:flex-col gap-1 text-sm min-w-0 sm:min-w-[60px]">
                                            <dt className="font-medium sm:font-normal">비중:</dt>
                                            <dd className="font-semibold">{item.percentage.toFixed(1)}%</dd>
                                        </dl>
                                    </>
                                ) : (
                                    <p className="text-sm text-description">
                                        {!item.isKrwMarket ? '원화 마켓 아님' :
                                            item.isPriceExceeded ? '보유 원화의 20% 초과' : '매수 불가'}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                ))
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
                    <dd className="text-lg sm:text-xl font-bold text-main">{portfolioResult.totalValue.toLocaleString()}원</dd>
                </dl>
                <dl className="flex justify-between items-center text-sm">
                    <dt className="text-slate-600">매수 종목</dt>
                    <dd className="font-medium">{portfolioResult.availableCount}개</dd>
                </dl>
                {portfolioResult.availableCount > 0 && (
                    <dl className="flex justify-between items-center text-sm">
                        <dt className="text-slate-600">종목별 평균 분배 비율</dt>
                        <dd className="font-medium">{(100 / portfolioResult.availableCount).toFixed(1)}%</dd>
                    </dl>
                )}
            </section>

            {/* 매수 버튼 */}
            <Button
                ariaLabel='포트폴리오 결과 매수 버튼'
                text={isPending ? "매수 진행 중..." :
                    portfolioResult.availableCount === 0 ? "매수 가능한 종목이 없습니다" :
                        "이대로 매수하기"}
                disabled={isPending || portfolioResult.totalValue === 0 || portfolioResult.availableCount === 0}
                onClick={handlePurchasePortfolio}
                customClassName="flex-1 py-3 sm:py-4 text-base sm:text-lg font-semibold bg-gradient-to-r from-main to-blue-600 hover:from-blue-600 hover:to-main transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none disabled:shadow-md"
            />
        </Card>
    );
}