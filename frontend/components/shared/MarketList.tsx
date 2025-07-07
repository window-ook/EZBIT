"use client";

import { useMemo, useEffect, useState, useContext } from 'react';
import { useFetchMarkets } from '@/hooks/api/useFetchMarkets';
import { useConnectTicker } from '@/hooks/socket/useConnectTicker';
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

export default function MarketList() {
    const { tickers, krwNames, setTickers, setKrwNames, setSelectedMarket } = useContext(TickerContext);

    const [searchKeyword, setSearchKeyword] = useState<string>('');

    const { markets } = useFetchMarkets();
    useConnectTicker({ markets, setTickers });

    // {"KRW-BTC": "비트코인", "KRW-ETH": "이더리움", ...}
    const localKrwNames = useMemo<Record<string, string>>(() => {
        const map: Record<string, string> = {};
        markets?.forEach(market => { map[market.market] = market.korean_name; });
        return map;
    }, [markets]);

    useEffect(() => {
        if (markets) setKrwNames(localKrwNames);
    }, [markets, localKrwNames, setKrwNames]);

    // 검색 기능
    const filteredMarkets = useMemo(() => {
        if (!markets) return [];
        if (!searchKeyword) return markets;

        const lowerKeyword = searchKeyword.toLowerCase();

        return markets.filter(m =>
            m.korean_name.toLowerCase().includes(lowerKeyword) ||
            m.market.toLowerCase().includes(lowerKeyword)
        );
    }, [markets, searchKeyword]);

    const handleSelectMarket = (market: string) => setSelectedMarket(market);

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
                    onChange={e => setSearchKeyword(e.target.value)}
                />
                {searchKeyword && <button
                    type="button"
                    className="absolute right-10 top-1/2 -translate-y-1/2 text-description cursor-pointer hover:opacity-50 transition-all duration-150 ease-in"
                    onClick={() => setSearchKeyword('')}
                ><X /></button>}
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
                            const ticker = tickers[market.market] || {};
                            return (
                                <TableRow
                                    className="hover:bg-list-hover cursor-pointer transition-all duration-150 ease-in"
                                    key={market.market}
                                    onClick={() => handleSelectMarket(market.market)}
                                >
                                    {/* 코인명 */}
                                    <TableCell className="w-[6.75rem] py-1 px-0.5 text-left align-middle">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-xs">{krwNames[market.market]}</span>
                                            <span className="text-market-code text-xs">{market.market}</span>
                                        </div>
                                    </TableCell>

                                    {/* 현재가 */}
                                    <TableCell
                                        className={`w-[4rem] py-1 px-0.5 text-right align-middle font-bold text-[0.6rem] ${ticker.signed_change_rate < 0
                                            ? 'text-negative'
                                            : ticker.signed_change_rate > 0
                                                ? 'text-positive'
                                                : 'text-black'
                                            }`}
                                    >
                                        {ticker.trade_price !== undefined && ticker.trade_price !== null
                                            ? ticker.trade_price.toLocaleString()
                                            : 0}
                                    </TableCell>

                                    {/* 전일대비 */}
                                    <TableCell
                                        className={`w-[4rem] py-1 px-0.5 text-right align-middle font-bold text-[0.6rem] ${ticker.signed_change_rate < 0
                                            ? 'text-negative'
                                            : ticker.signed_change_rate > 0
                                                ? 'text-positive'
                                                : 'text-black'
                                            }`}
                                    >
                                        <div className="flex flex-col">
                                            <span>{ticker.signed_change_rate !== undefined ? (ticker.signed_change_rate * 100).toFixed(2) : '0.00'}%</span>
                                            <span className="text-market-code text-[0.6rem]">{ticker.signed_change_price !== undefined ? ticker.signed_change_price.toLocaleString() : 0}</span>
                                        </div>
                                    </TableCell>

                                    {/* 거래대금 */}
                                    <TableCell className="w-[4rem] py-1 px-0.5 text-right align-middle whitespace-nowrap">
                                        <div className="flex flex-col">
                                            <span className="text-[0.6rem]">
                                                {ticker.acc_trade_price_24h !== undefined ? Math.round(ticker.acc_trade_price_24h / 1000000).toLocaleString() : 0}
                                            </span>
                                            <span className="text-[0.6rem]">백만</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </section>
        </Card>
    );
}
