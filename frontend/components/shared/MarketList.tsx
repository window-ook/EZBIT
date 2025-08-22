"use client";

import React, { useMemo, useEffect, useState, useContext, useCallback, memo } from 'react';
import { useMarkets } from '@/hooks/upbit/useMarkets';
import { useInitialTickers } from '@/hooks/upbit/useInitialTickers';
import { useTickerSocket } from '@/hooks/socket/useTickerSocket';
import { TickerContext } from '@/providers/TickerProvider';
import { ITicker } from '@/types/upbit/ticker';
import { Card } from '@/components/shadcn-ui/card';
import { Input } from '@/components/shadcn-ui/input';
import { Table, TableRow, TableBody, TableCell, } from '@/components/shadcn-ui/table';
import { Search, X } from 'lucide-react';

const PRICE_COLORS = {
    positive: 'text-positive',
    negative: 'text-negative',
    neutral: 'text-black'
} as const;

const TABLE_HEADER_STYLES = 'py-1 px-0.5 text-2xs font-bold font-chart-header text-white';

const TABLE_BODY_STYLES = {
    name: 'w-[6.75rem] py-1 px-0.5 text-left align-middle',
    price: 'w-[5rem] py-1 px-0.5 text-right align-middle font-bold text-xs font-mono tracking-tight',
    change: 'w-[5.5rem] py-1 px-0.5 text-right align-middle font-bold text-xs font-mono tracking-tight',
    volume: 'w-[5rem] py-1 px-0.5 text-right align-middle text-xs font-mono tracking-tight whitespace-nowrap'
} as const;

interface IMarketRow {
    market: string;
    koreanName: string;
    ticker: ITicker;
    onSelectMarket: (market: string) => void;
}

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
        <TableRow
            className="hover:bg-slate-200 cursor-pointer transition-all duration-150 ease-in"
            onClick={handleClick}
        >
            {/* 코인명 */}
            <TableCell className={TABLE_BODY_STYLES.name}>
                <div className="flex flex-col">
                    <span className="font-market-korean font-bold text-xs">{koreanName}</span>
                    <span className="font-market-code text-xs">{market}</span>
                </div>
            </TableCell>

            {/* 현재가 */}
            <TableCell className={`${TABLE_BODY_STYLES.price} ${priceColor}`}>
                <div className="min-w-0 overflow-hidden font-price">
                    {formattedValues.tradePrice}
                </div>
            </TableCell>

            {/* 전일대비 */}
            <TableCell className={`${TABLE_BODY_STYLES.change} ${priceColor}`}>
                <div className="flex flex-col min-w-0">
                    <span className="overflow-hidden text-ellipsis font-percentage">{formattedValues.changeRate}%</span>
                    <span className="text-market-code overflow-hidden text-ellipsis font-price">{formattedValues.changePrice}</span>
                </div>
            </TableCell>

            {/* 거래대금 */}
            <TableCell className={TABLE_BODY_STYLES.volume}>
                <div className="min-w-0 overflow-hidden text-ellipsis font-price">
                    {formattedValues.volume}
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
    const { initialTickers } = useInitialTickers();

    useEffect(() => {
        if (initialTickers && Object.keys(initialTickers).length > 0) setTickers(initialTickers);
    }, [initialTickers, setTickers]);

    useTickerSocket({ markets, setTickers, initialTickers });

    // {"KRW-BTC": "비트코인", "KRW-ETH": "이더리움", ...}
    const localKrwNames = useMemo<Record<string, string>>(() => {
        if (!markets) return {};
        const map: Record<string, string> = {};
        for (const market of markets) map[market.market] = market.korean_name;
        return map;
    }, [markets]);

    useEffect(() => {
        if (markets && Object.keys(localKrwNames).length > 0) setKrwNames(localKrwNames);
    }, [markets, localKrwNames, setKrwNames]);

    const filteredMarkets = useMemo(() => {
        if (!markets) return [];
        if (!searchKeyword.trim()) return markets;

        const lowerKeyword = searchKeyword.toLowerCase().trim();

        return markets.filter(m =>
            m.korean_name.toLowerCase().includes(lowerKeyword) ||
            m.market.toLowerCase().includes(lowerKeyword)
        );
    }, [markets, searchKeyword]);

    const handleSelectMarket = useCallback((market: string) => setSelectedMarket(market), [setSelectedMarket]);
    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setSearchKeyword(e.target.value), []);
    const handleClearSearch = useCallback(() => setSearchKeyword(''), []);

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
                    <div className={`${TABLE_HEADER_STYLES} w-[6.75rem] text-left`}>이름</div>
                    <div className={`${TABLE_HEADER_STYLES} w-[5rem] text-right`}>현재가</div>
                    <div className={`${TABLE_HEADER_STYLES} w-[5.5rem] text-right`}>전일대비</div>
                    <div className={`${TABLE_HEADER_STYLES} w-[5rem] text-right`}>거래대금(백만)</div>
                </div>
            </div>

            {/* 바디 */}
            <section className="max-w-full h-[15rem] md:h-full overflow-y-auto overflow-x-hidden bg-white">
                <Table>
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