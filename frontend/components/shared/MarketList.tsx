"use client";

import React, { useMemo, useEffect, useState, useContext, useCallback, memo } from 'react';
import { useMarkets } from '@/hooks/upbit/useMarkets';
import { useTickerSocket } from '@/hooks/socket/useTickerSocket';
import { TickerContext } from '@/providers/TickerProvider';
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from '@/components/shadcn-ui/table';
import { Card } from '@/components/shadcn-ui/card';
import { Input } from '@/components/shadcn-ui/input';
import { Search, X } from 'lucide-react';
import { ITicker } from '@/types/upbit/ticker';

// 색상 클래스 상수 (성능 최적화)
const PRICE_COLORS = {
    positive: 'text-positive',
    negative: 'text-negative',
    neutral: 'text-black'
} as const;

// 스타일 상수
const TABLE_CELL_STYLES = {
    name: 'w-[6.75rem] py-1 px-0.5 text-left align-middle',
    price: 'w-[4rem] py-1 px-0.5 text-right align-middle font-bold text-[0.6rem]',
    change: 'w-[4rem] py-1 px-0.5 text-right align-middle font-bold text-[0.6rem]',
    volume: 'w-[4rem] py-1 px-0.5 text-right align-middle whitespace-nowrap'
} as const;

// 메모이제이션된 MarketRow 컴포넌트
interface IMarketRow {
    market: string;
    koreanName: string;
    ticker: ITicker;
    onSelectMarket: (market: string) => void;
}

const MarketRow = memo<IMarketRow>(({ market, koreanName, ticker, onSelectMarket }) => {
    // 색상 계산 (메모이제이션)
    const priceColor = useMemo(() => {
        const rate = ticker.signed_change_rate || 0;
        return rate < 0 ? PRICE_COLORS.negative
            : rate > 0 ? PRICE_COLORS.positive
                : PRICE_COLORS.neutral;
    }, [ticker.signed_change_rate]);

    // 클릭 핸들러 (메모이제이션)
    const handleClick = useCallback(() => {
        onSelectMarket(market);
    }, [market, onSelectMarket]);

    // 포맷된 값들 (메모이제이션)
    const formattedValues = useMemo(() => ({
        tradePrice: ticker.trade_price?.toLocaleString() || '0',
        changeRate: ticker.signed_change_rate ? (ticker.signed_change_rate * 100).toFixed(2) : '0.00',
        changePrice: ticker.signed_change_price?.toLocaleString() || '0',
        volume: ticker.acc_trade_price_24h ? Math.round(ticker.acc_trade_price_24h / 1000000).toLocaleString() : '0'
    }), [ticker.trade_price, ticker.signed_change_rate, ticker.signed_change_price, ticker.acc_trade_price_24h]);

    return (
        <TableRow
            className="hover:bg-list-hover cursor-pointer transition-all duration-150 ease-in"
            onClick={handleClick}
        >
            {/* 코인명 */}
            <TableCell className={TABLE_CELL_STYLES.name}>
                <div className="flex flex-col">
                    <span className="font-bold text-xs">{koreanName}</span>
                    <span className="text-market-code text-xs">{market}</span>
                </div>
            </TableCell>

            {/* 현재가 */}
            <TableCell className={`${TABLE_CELL_STYLES.price} ${priceColor}`}>
                {formattedValues.tradePrice}
            </TableCell>

            {/* 전일대비 */}
            <TableCell className={`${TABLE_CELL_STYLES.change} ${priceColor}`}>
                <div className="flex flex-col">
                    <span>{formattedValues.changeRate}%</span>
                    <span className="text-market-code text-[0.6rem]">{formattedValues.changePrice}</span>
                </div>
            </TableCell>

            {/* 거래대금 */}
            <TableCell className={TABLE_CELL_STYLES.volume}>
                <div className="flex flex-col">
                    <span className="text-[0.6rem]">{formattedValues.volume}</span>
                    <span className="text-[0.6rem]">백만</span>
                </div>
            </TableCell>
        </TableRow>
    );
});

MarketRow.displayName = 'MarketRow';

function MarketList() {
    const { tickers, krwNames, setTickers, setKrwNames, setSelectedMarket } = useContext(TickerContext);

    const [searchKeyword, setSearchKeyword] = useState<string>('');

    const { markets } = useMarkets();

    useTickerSocket({ markets, setTickers });

    // {"KRW-BTC": "비트코인", "KRW-ETH": "이더리움", ...}
    const localKrwNames = useMemo<Record<string, string>>(() => {
        if (!markets) return {};
        const map: Record<string, string> = {};
        for (const market of markets) {
            map[market.market] = market.korean_name;
        }
        return map;
    }, [markets]);

    useEffect(() => {
        if (markets && Object.keys(localKrwNames).length > 0) {
            setKrwNames(localKrwNames);
        }
    }, [markets, localKrwNames, setKrwNames]);

    // 검색 기능 (디바운스 없이 최적화)
    const filteredMarkets = useMemo(() => {
        if (!markets) return [];
        if (!searchKeyword.trim()) return markets;

        const lowerKeyword = searchKeyword.toLowerCase().trim();
        return markets.filter(m =>
            m.korean_name.toLowerCase().includes(lowerKeyword) ||
            m.market.toLowerCase().includes(lowerKeyword)
        );
    }, [markets, searchKeyword]);

    // 메모이제이션된 마켓 선택 핸들러
    const handleSelectMarket = useCallback((market: string) => {
        setSelectedMarket(market);
    }, [setSelectedMarket]);

    // 검색어 클리어 핸들러
    const handleClearSearch = useCallback(() => {
        setSearchKeyword('');
    }, []);

    // 검색어 변경 핸들러
    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchKeyword(e.target.value);
    }, []);

    return (
        <Card className="flex flex-col h-full">
            {/* 검색 입력창 */}
            <section className="relative w-full px-2">
                <Input
                    aria-label="코인명 검색"
                    type="text"
                    className="w-full h-full bg-white outline-none border-none"
                    placeholder="코인명/심볼 검색"
                    value={searchKeyword}
                    onChange={handleSearchChange}
                />
                {searchKeyword && (
                    <button
                        type="button"
                        className="absolute right-10 top-1/2 -translate-y-1/2 text-description cursor-pointer hover:opacity-50 transition-all duration-150 ease-in"
                        onClick={handleClearSearch}
                    >
                        <X />
                    </button>
                )}
                <span className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Search />
                </span>
            </section>

            {/* 테이블 영역 */}
            <section className="max-w-full h-full overflow-y-auto overflow-x-hidden m-0 p-0 bg-white">
                <Table>
                    <TableHeader className="sticky top-0 z-10 bg-main">
                        <TableRow>
                            <TableHead className="w-[6.75rem] py-[0.25rem] text-white text-[0.5rem] lg:text-xs font-bold">이름</TableHead>
                            <TableHead className="w-[4rem] py-[0.25rem] text-white text-[0.5rem] lg:text-xs font-bold text-right">현재가</TableHead>
                            <TableHead className="w-[4rem] py-[0.25rem] text-white text-[0.5rem] lg:text-xs font-bold text-right">전일대비</TableHead>
                            <TableHead className="w-[4rem] py-[0.25rem] text-white text-[0.5rem] lg:text-xs font-bold text-right">거래대금</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredMarkets.map(market => {
                            const ticker = tickers[market.market] || {
                                market: market.market,
                                trade_price: 0,
                                prev_closing_price: 0,
                                signed_change_rate: 0,
                                signed_change_price: 0,
                                acc_trade_price_24h: 0,
                                acc_trade_volume_24h: 0,
                                high_price: 0,
                                low_price: 0,
                                lowest_52_week_price: 0,
                                highest_52_week_price: 0,
                            };
                            const koreanName = krwNames[market.market] || market.korean_name;

                            return (
                                <MarketRow
                                    key={market.market}
                                    market={market.market}
                                    koreanName={koreanName}
                                    ticker={ticker}
                                    onSelectMarket={handleSelectMarket}
                                />
                            );
                        })}
                    </TableBody>
                </Table>
            </section>
        </Card>
    );
}

export default memo(MarketList);