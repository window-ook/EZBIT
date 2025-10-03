import { ITopCoins } from '@/types/upbit/topCoins';
import { ITicker } from '@/types/upbit/ticker';
import { PortfolioOption, IPilotItem, IPilotResult } from '@/types/portfolio-pilot/portfolioPilot';

/**
 * 포트폴리오 계산 로직
 * @param selectedData TOP 코인 데이터 (rate/volume/giant)
 * @param investmentAmount 투자 금액
 * @param tickers 실시간 ticker 데이터
 * @param selectedOption 선택된 포트폴리오 옵션
 * @returns 계산된 포트폴리오 결과
 */
export function calculatePortfolio(
    selectedData: ITopCoins[],
    investmentAmount: number,
    tickers: Record<string, ITicker>,
    selectedOption: PortfolioOption
): IPilotResult {
    if (selectedData.length === 0) {
        return {
            selectedOption,
            totalAmount: investmentAmount,
            portfolio: [],
            totalValue: 0,
            availableCount: 0
        };
    }

    // 1. KRW 마켓 종목만 필터링 (모든 가격대 포함)
    const availableCoins = selectedData.filter((coin) => {
        const isKrwMarket = coin.code.includes('/KRW');
        const marketCode = `KRW-${coin.code.split('/')[0]}`;
        const currentPrice = tickers[marketCode]?.trade_price ?? 0;

        return isKrwMarket && currentPrice > 0;
    });

    // 2. 기본 종목 수로 균등 분배(20% * 5종목)
    const availableCount = availableCoins.length;
    const baseAmountPerCoin = availableCount > 0 ? Math.floor(investmentAmount / availableCount) : 0;
    const maxAllowedAmount = Math.floor(investmentAmount / 5);

    // 3. 전체 포트폴리오 생성
    const portfolio: IPilotItem[] = selectedData.map((coin) => {
        const marketCode = `KRW-${coin.code.split('/')[0]}`;
        const currentPrice = tickers[marketCode]?.trade_price ?? 0;
        const isKrwMarket = coin.code.includes('/KRW');
        const canPurchase = isKrwMarket && currentPrice > 0;

        if (!canPurchase) {
            return {
                code: coin.code,
                name: coin.name,
                rank: coin.rank,
                rate: coin.rate,
                allocatedAmount: 0,
                currentPrice,
                quantity: 0,
                percentage: 0,
                canPurchase: false,
                isKrwMarket,
                isPriceExceeded: false
            };
        }

        // 20% 한도를 초과하는 경우 한도 제한
        const actualAmount = currentPrice > maxAllowedAmount ? maxAllowedAmount : baseAmountPerCoin;
        const quantity = actualAmount / currentPrice;
        const percentage = availableCount > 0 ? Math.round((actualAmount / investmentAmount) * 10000) / 100 : 0;

        return {
            code: coin.code,
            name: coin.name,
            rank: coin.rank,
            rate: coin.rate,
            allocatedAmount: actualAmount,
            currentPrice,
            quantity,
            percentage,
            canPurchase: true,
            isKrwMarket: true,
            isPriceExceeded: currentPrice > maxAllowedAmount
        };
    });

    const totalValue = portfolio.reduce((sum, item) => sum + item.allocatedAmount, 0);

    return {
        selectedOption,
        totalAmount: investmentAmount,
        portfolio,
        totalValue,
        availableCount
    };
}