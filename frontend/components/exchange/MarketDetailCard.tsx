'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcn-ui/card";
import { TickerContext } from '@/providers/TickerProvider';
import { useContext } from 'react';

const SubIndicator = ({ label, value, valueStyle }: { label?: string, value?: number, valueStyle?: string }) => {
    return (
        <div className='w-[13rem]'>
            <div className="flex gap-4 justify-between">
                <span className="text-xs self-end whitespace-nowrap">
                    {label}
                </span>
                <span className={`text-xs font-medium self-end ${valueStyle === 'neg' ? 'text-negative' : valueStyle === 'pos' ? 'text-positive' : 'text-black'}`}>
                    {value !== undefined ? Number(value).toLocaleString() : '-'}
                </span>
            </div>
            <div className="bg-gray-300 w-full h-[0.05rem]" />
        </div>
    );
};

export default function MarketDetailCard() {
    const { tickers, selectedMarket, krwNames } = useContext(TickerContext);

    const ticker = tickers[selectedMarket];
    const krwName = krwNames[selectedMarket];

    return (
        <Card className="w-full bg-white">
            <CardHeader className='flex justify-between'>
                <div className="flex flex-wrap gap-1 items-end">
                    <CardTitle className="text-2xl font-bold">
                        {krwName}
                    </CardTitle>
                    <span>
                        {ticker?.market}
                    </span>
                </div>
                <div>
                    <div className='w-[10rem] flex justify-between'>
                        <span className="text-xs whitespace-nowrap">
                            52주 최고
                        </span>
                        <span className="text-xs font-medium text-positive whitespace-nowrap">
                            {ticker?.highest_52_week_price}
                        </span>
                    </div>
                    <div className='w-[10rem] flex justify-between'>
                        <span className="text-xs whitespace-nowrap">
                            52주 최저
                        </span>
                        <span className="text-xs font-medium text-negative whitespace-nowrap">
                            {ticker?.lowest_52_week_price}
                        </span>
                    </div>
                </div>
            </CardHeader>

            <div className="bg-slate-300 w-full h-[0.05rem]" />

            {/* 현재가, 인디케이터, 거래량, 거래대금 */}
            <CardContent className="flex justify-between">
                <section className="flex flex-col justify-center">
                    <div className="flex items-end">
                        {/* 현재가 자리 */}
                        <span className="text-2xl font-bold text-black">
                            {Number(ticker?.trade_price).toLocaleString()}
                        </span>
                        <span className="text-black">KRW</span>
                    </div>
                    <div className="flex justify-between gap-2 items-center">
                        <span className="text-[0.75rem] text-market-code font-bold">
                            전일대비
                        </span>
                        {/* 전일대비 비율 자리 */}
                        <span className=" text-black">
                            {Number(ticker?.signed_change_rate) > 0 ? '+' : ''}
                            {Number(ticker?.signed_change_rate * 100).toFixed(2)}%
                        </span>
                        {/* 전일대비 가격 변화 자리 */}
                        <span className=" text-black">
                            {Number(ticker?.signed_change_price) < 0
                                ? '▼'
                                : Number(ticker?.signed_change_price) > 0
                                    ? '▲'
                                    : ''}
                            {Number(ticker?.signed_change_price).toLocaleString()}
                        </span>
                    </div>
                </section>

                <section className="hidden sm:flex gap-2">
                    <div className="flex flex-col justify-center shrink grow basis-full w-full">
                        <SubIndicator
                            label="고가"
                            value={ticker?.high_price}
                            valueStyle={'pos'}
                        />
                        <SubIndicator
                            label="저가"
                            value={ticker?.low_price}
                            valueStyle={'neg'}
                        />
                    </div>
                    <div className="flex flex-col justify-center shrink grow basis-full w-full">
                        <SubIndicator
                            label="거래량(24H)"
                            value={ticker?.acc_trade_volume_24h}
                            valueStyle={'normal'}
                        />
                        <SubIndicator
                            label="거래대금(24H)"
                            value={ticker?.acc_trade_price_24h}
                            valueStyle={'normal'}
                        />
                    </div>
                </section>
            </CardContent>
        </Card >
    );
}
