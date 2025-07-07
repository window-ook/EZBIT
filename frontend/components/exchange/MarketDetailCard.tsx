'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcn-ui/card";
import { TickerContext } from '@/providers/TickerProvider';
import { useContext } from 'react';

interface ISubIndicator {
    label?: string,
    value?: number,
    valueStyle?: string
}

/** 보조 지표
 * @param {string} label 보조 지표 라벨
 * @param {number} value 보조 지표 값
 * @param {string} valueStyle 보조 지표 값 스타일 코드
 */
const SubIndicator = ({ label, value, valueStyle }: ISubIndicator) => {
    return (
        <div className='w-[13rem]'>
            <div className="flex gap-4 justify-between">
                <span className="text-xs self-end whitespace-nowrap">
                    {label}
                </span>
                <span className={`text-xs font-medium self-end ${valueStyle === 'neg' ? 'text-negative' : valueStyle === 'pos' ? 'text-positive' : ''}`}>
                    {value !== undefined ? Number(value).toLocaleString() : '-'}
                </span>
            </div>
            <div className="bg-gray-300 w-full h-[0.05rem]" />
        </div>
    );
};

export default function MarketDetailCard() {
    const { currentTicker, selectedMarket, krwNames } = useContext(TickerContext);

    const krwName = krwNames[selectedMarket];

    return (
        <Card className="w-full bg-white">
            <CardHeader className='flex justify-between'>
                {/* 종목 이름 */}
                <section className="flex flex-wrap gap-1 items-end">
                    <CardTitle className="text-2xl font-bold">{krwName}</CardTitle>
                    <span>{currentTicker?.market}</span>
                </section>

                {/* 52주 최고, 최저 */}
                <section>
                    <div className='w-[10rem] flex justify-between'>
                        <span className="text-xs whitespace-nowrap">
                            52주 최고
                        </span>
                        <span className="text-xs font-medium text-positive whitespace-nowrap">
                            {currentTicker?.highest_52_week_price}
                        </span>
                    </div>
                    <div className='w-[10rem] flex justify-between'>
                        <span className="text-xs whitespace-nowrap">
                            52주 최저
                        </span>
                        <span className="text-xs font-medium text-negative whitespace-nowrap">
                            {currentTicker?.lowest_52_week_price}
                        </span>
                    </div>
                </section>
            </CardHeader>

            <div className="bg-slate-300 w-full h-[0.05rem]" />

            {/* 현재가, 인디케이터, 거래량, 거래대금 */}
            <CardContent className="flex justify-between">
                <section className="flex flex-col justify-center">
                    <div className="flex items-end">
                        {/* 현재가 자리 */}
                        <span className="text-2xl font-bold">
                            {Number(currentTicker?.trade_price).toLocaleString()}
                        </span>
                        <span>KRW</span>
                    </div>
                    <div className="flex justify-between gap-2 items-center">
                        <span className="text-[0.75rem] text-market-code font-bold">
                            전일대비
                        </span>
                        {/* 전일대비 비율 자리 */}
                        <span>
                            {Number(currentTicker?.signed_change_rate) > 0 ? '+' : ''}
                            {Number(currentTicker?.signed_change_rate * 100).toFixed(2)}%
                        </span>
                        {/* 전일대비 가격 변화 자리 */}
                        <span>
                            {Number(currentTicker?.signed_change_price) < 0
                                ? '▼'
                                : Number(currentTicker?.signed_change_price) > 0
                                    ? '▲'
                                    : ''}
                            {Number(currentTicker?.signed_change_price).toLocaleString()}
                        </span>
                    </div>
                </section>

                {/* 보조 지표 */}
                <section className="hidden sm:flex gap-2">
                    <div className="flex flex-col justify-center shrink grow basis-full w-full">
                        <SubIndicator
                            label="고가"
                            value={currentTicker?.high_price}
                            valueStyle={'pos'}
                        />
                        <SubIndicator
                            label="저가"
                            value={currentTicker?.low_price}
                            valueStyle={'neg'}
                        />
                    </div>
                    <div className="flex flex-col justify-center shrink grow basis-full w-full">
                        <SubIndicator
                            label="거래량(24H)"
                            value={currentTicker?.acc_trade_volume_24h}
                            valueStyle={'normal'}
                        />
                        <SubIndicator
                            label="거래대금(24H)"
                            value={currentTicker?.acc_trade_price_24h}
                            valueStyle={'normal'}
                        />
                    </div>
                </section>
            </CardContent>
        </Card >
    );
}
