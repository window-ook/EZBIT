"use client";

import React, { useMemo, useEffect, useState, useContext, useCallback, memo, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useMarkets } from '@/hooks/upbit/useMarkets';
import { useInitialTickers } from '@/hooks/upbit/useInitialTickers';
import { useTickerSocket } from '@/hooks/socket/useTickerSocket';
import { TickerContext } from '@/providers/TickerProvider';
import { ITicker } from '@/types/upbit/ticker';
import { Card } from '@/components/shadcn-ui/card';
import { Input } from '@/components/shadcn-ui/input';
import { Search, X, ChevronUp, ChevronDown } from 'lucide-react';

type SortField = 'name' | 'price' | 'change' | 'volume';
type SortOrder = 'asc' | 'desc' | null;

interface IMarketRow {
    market: string;
    koreanName: string;
    ticker: ITicker;
    onSelectMarket: (market: string) => void;
}

const PRICE_COLORS = {
    positive: 'text-positive',
    negative: 'text-negative',
    neutral: 'text-black'
} as const;

const TABLE_HEADER_STYLES = 'py-1 px-0.5 text-2xs font-bold font-chart-header text-white';

const ROW_CELL_STYLES = {
    name: 'w-[6.75rem] py-1 px-0.5 text-left flex flex-col justify-center whitespace-nowrap',
    price: 'w-[5rem] py-1 px-0.5 text-right flex items-center justify-end font-bold text-xs font-mono tracking-tight',
    change: 'w-[5.5rem] py-1 px-0.5 text-right flex flex-col items-end justify-center font-bold text-xs font-mono tracking-tight',
    volume: 'w-[5rem] py-1 px-0.5 text-right flex items-center justify-end text-xs font-mono tracking-tight whitespace-nowrap'
} as const;

const MARKET_ROW_HEIGHT = 44;

const MarketRow = memo<IMarketRow>(({ market, koreanName, ticker, onSelectMarket }) => {
    const priceColor = useMemo(() => {
        const rate = ticker.signed_change_rate || 0;
        return rate < 0 ? PRICE_COLORS.negative : rate > 0 ? PRICE_COLORS.positive : PRICE_COLORS.neutral;
    }, [ticker.signed_change_rate]);

    const formattedValues = useMemo(() => ({
        tradePrice: ticker.trade_price?.toLocaleString() || '0',
        changeRate: ticker.signed_change_rate ? (ticker.signed_change_rate * 100).toFixed(2) : '0.00',
        changePrice: ticker.signed_change_price?.toLocaleString() || '0',
        volume: ticker.acc_trade_price_24h ? Math.round(ticker.acc_trade_price_24h / 1000000).toLocaleString() : '0'
    }), [ticker.trade_price, ticker.signed_change_rate, ticker.signed_change_price, ticker.acc_trade_price_24h]);

    const handleClick = useCallback(() => onSelectMarket(market), [market, onSelectMarket]);

    return (
        <div
            className="flex items-center gap-6 hover:bg-slate-200 cursor-pointer transition-all duration-150 ease-in border-b border-gray-100"
            onClick={handleClick}
        >
            {/* 코인명 */}
            <div className={ROW_CELL_STYLES.name}>
                <span className="font-market-korean font-bold text-xs">{koreanName}</span>
                <span className="font-market-code text-xs">{market}</span>
            </div>

            {/* 현재가 */}
            <div className={`${ROW_CELL_STYLES.price} ${priceColor}`}>
                <span className="min-w-0 overflow-hidden font-price">
                    {formattedValues.tradePrice}
                </span>
            </div>

            {/* 전일대비 */}
            <div className={`${ROW_CELL_STYLES.change} ${priceColor}`}>
                <span className="overflow-hidden text-ellipsis font-percentage">{formattedValues.changeRate}%</span>
                <span className="text-market-code overflow-hidden text-ellipsis font-price">{formattedValues.changePrice}</span>
            </div>

            {/* 거래대금 */}
            <div className={ROW_CELL_STYLES.volume}>
                <span className="min-w-0 overflow-hidden text-ellipsis font-price">
                    {formattedValues.volume}
                </span>
            </div>
        </div>
    );
});

MarketRow.displayName = 'MarketRow';

function MarketList() {
    const { tickers, krwNames, setTickers, setKrwNames, setSelectedMarket } = useContext(TickerContext);

    const [searchKeyword, setSearchKeyword] = useState<string>('');
    const [sortField, setSortField] = useState<SortField | null>(null);
    const [sortOrder, setSortOrder] = useState<SortOrder>(null);

    const parentRef = useRef<HTMLDivElement>(null);

    const { markets } = useMarkets();
    const { initialTickers } = useInitialTickers();

    useEffect(() => {
        if (initialTickers && Object.keys(initialTickers).length > 0) setTickers(initialTickers);
    }, [initialTickers, setTickers]);

    useTickerSocket({ markets, setTickers, initialTickers });

    const localKrwNames = useMemo<Record<string, string>>(() => {
        if (!markets) return {};
        const map: Record<string, string> = {};
        for (const market of markets) map[market.market] = market.korean_name;
        return map;
    }, [markets]);

    useEffect(() => {
        if (markets && Object.keys(localKrwNames).length > 0) setKrwNames(localKrwNames);
    }, [markets, localKrwNames, setKrwNames]);

    const filteredAndSortedMarkets = useMemo(() => {
        if (!markets) return [];

        let filtered = markets;

        if (searchKeyword.trim()) {
            const lowerKeyword = searchKeyword.toLowerCase().trim();
            filtered = markets.filter(m =>
                m.korean_name.toLowerCase().includes(lowerKeyword) ||
                m.market.toLowerCase().includes(lowerKeyword)
            );
        }

        if (!sortField || !sortOrder) return filtered;

        return [...filtered].sort((a, b) => {
            const tickerA = tickers[a.market];
            const tickerB = tickers[b.market];

            let valueA: number | string = 0;
            let valueB: number | string = 0;

            switch (sortField) {
                case 'name':
                    valueA = a.korean_name;
                    valueB = b.korean_name;
                    break;
                case 'price':
                    valueA = tickerA?.trade_price || 0;
                    valueB = tickerB?.trade_price || 0;
                    break;
                case 'change':
                    valueA = tickerA?.signed_change_rate || 0;
                    valueB = tickerB?.signed_change_rate || 0;
                    break;
                case 'volume':
                    valueA = tickerA?.acc_trade_price_24h || 0;
                    valueB = tickerB?.acc_trade_price_24h || 0;
                    break;
            }

            if (typeof valueA === 'string' && typeof valueB === 'string') {
                return sortOrder === 'asc'
                    ? valueA.localeCompare(valueB)
                    : valueB.localeCompare(valueA);
            }

            const numA = Number(valueA);
            const numB = Number(valueB);
            return sortOrder === 'asc' ? numA - numB : numB - numA;
        });
    }, [markets, searchKeyword, sortField, sortOrder, tickers]);

    useEffect(() => {
        if (parentRef.current) parentRef.current.scrollTop = 0;
    }, [searchKeyword, sortField, sortOrder]);

    const rowVirtualizer = useVirtualizer({
        count: filteredAndSortedMarkets.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => MARKET_ROW_HEIGHT,
        overscan: 5,
        useFlushSync: false
    });

    const virtualItems = rowVirtualizer.getVirtualItems();

    const handleSelectMarket = useCallback((market: string) => setSelectedMarket(market), [setSelectedMarket]);
    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setSearchKeyword(e.target.value), []);
    const handleClearSearch = useCallback(() => setSearchKeyword(''), []);

    const handleSort = useCallback((field: SortField) => {
        if (sortField === field) {
            if (sortOrder === 'asc') setSortOrder('desc');
            else if (sortOrder === 'desc') {
                setSortField(null);
                setSortOrder(null);
            } else {
                setSortOrder('asc');
            }
        } else {
            setSortField(field);
            setSortOrder('asc');
        }
    }, [sortField, sortOrder]);

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

                <Search className="absolute right-3 top-1/2 -translate-y-1/2 size-4" />
            </section>

            {/* 헤드 */}
            <div className="sticky top-0 z-10 p-2 bg-main">
                <div className="flex items-center gap-6">
                    <button
                        className={`${TABLE_HEADER_STYLES} w-[6.75rem] text-left flex items-center gap-1 cursor-pointer transition-opacity duration-150`}
                        onClick={() => handleSort('name')}
                    >
                        <span className="hover:underline">이름</span>
                        <div className="flex flex-col">
                            <ChevronUp
                                size={12}
                                className={sortField === 'name' && sortOrder === 'asc' ? 'opacity-100' : 'opacity-70'}
                            />
                            <ChevronDown
                                size={12}
                                className={sortField === 'name' && sortOrder === 'desc' ? 'opacity-100' : 'opacity-70'}
                            />
                        </div>
                    </button>
                    <button
                        className={`${TABLE_HEADER_STYLES} w-[5rem] text-right flex items-center justify-end gap-1 cursor-pointer transition-opacity duration-150`}
                        onClick={() => handleSort('price')}
                    >
                        <span className="hover:underline">현재가</span>
                        <div className="flex flex-col">
                            <ChevronUp
                                size={12}
                                className={sortField === 'price' && sortOrder === 'asc' ? 'opacity-100' : 'opacity-70'}
                            />
                            <ChevronDown
                                size={12}
                                className={sortField === 'price' && sortOrder === 'desc' ? 'opacity-100' : 'opacity-70'}
                            />
                        </div>
                    </button>
                    <button
                        className={`${TABLE_HEADER_STYLES} w-[5.5rem] text-right flex items-center justify-end gap-1 cursor-pointer transition-opacity duration-150`}
                        onClick={() => handleSort('change')}
                    >
                        <span className="hover:underline">전일대비</span>
                        <div className="flex flex-col">
                            <ChevronUp
                                size={12}
                                className={sortField === 'change' && sortOrder === 'asc' ? 'opacity-100' : 'opacity-70'}
                            />
                            <ChevronDown
                                size={12}
                                className={sortField === 'change' && sortOrder === 'desc' ? 'opacity-100' : 'opacity-70'}
                            />
                        </div>
                    </button>
                    <button
                        className={`${TABLE_HEADER_STYLES} w-[5rem] text-right flex items-center justify-end gap-1 cursor-pointer transition-opacity duration-150`}
                        onClick={() => handleSort('volume')}
                    >
                        <span className="hover:underline">거래대금(백만)</span>
                        <div className="flex flex-col">
                            <ChevronUp
                                size={12}
                                className={sortField === 'volume' && sortOrder === 'asc' ? 'opacity-100' : 'opacity-70'}
                            />
                            <ChevronDown
                                size={12}
                                className={sortField === 'volume' && sortOrder === 'desc' ? 'opacity-100' : 'opacity-70'}
                            />
                        </div>
                    </button>
                </div>
            </div>

            {/* 바디 - 가상 스크롤 적용 */}
            <section
                ref={parentRef}
                className="max-w-full h-[15rem] md:h-full overflow-y-auto overflow-x-hidden bg-white"
            >
                <div
                    style={{
                        height: `${rowVirtualizer.getTotalSize()}px`,
                        position: 'relative',
                        width: '100%',
                    }}
                >
                    {virtualItems.map(virtualRow => {
                        const market = filteredAndSortedMarkets[virtualRow.index];
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
                            <div
                                key={market.market}
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: `${virtualRow.size}px`,
                                    transform: `translateY(${virtualRow.start}px)`,
                                }}
                            >
                                <MarketRow
                                    market={market.market}
                                    koreanName={koreanName}
                                    ticker={ticker}
                                    onSelectMarket={handleSelectMarket}
                                />
                            </div>
                        );
                    })}
                </div>
            </section>
        </Card>
    );
}

export default memo(MarketList);