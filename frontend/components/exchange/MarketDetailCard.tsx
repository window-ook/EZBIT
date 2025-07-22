'use client';

import { useContext } from 'react';
import { TickerContext } from '@/providers/TickerProvider';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcn-ui/card";

interface ISubIndicator {
    label?: string,
    value?: number,
    valueStyle?: string
}

const WEEKS_52_BOX_STYLE = 'w-[10rem] flex justify-between';
const WEEKS_52_BOX_LABEL_STYLE = 'whitespace-nowrap text-xs';
const WEEKS_52_BOX_VALUE_STYLE = 'whitespace-nowrap text-xs font-medium';
const SUB_INDICATORS_COLUMN_STYLE = 'w-full basis-full flex flex-col justify-center gap-2 shrink grow';

/** 보조 지표
 * @param {string} label 보조 지표 라벨
 * @param {number} value 보조 지표 값
 * @param {string} valueStyle 보조 지표 값 스타일 코드
 */
const SubIndicator = ({ label, value, valueStyle }: ISubIndicator) => {
    return (
        <div className='w-[13rem]'>
            <dl className="flex gap-4 justify-between">
                <dt className="whitespace-nowrap text-xs self-end">
                    {label}
                </dt>
                <dd className={`text-xs font-medium self-end ${valueStyle === 'neg' ? 'text-negative' : valueStyle === 'pos' ? 'text-positive' : ''}`}>
                    {value !== undefined ? Number(value).toLocaleString() : '-'}
                </dd>
            </dl>
            <div className="w-full h-[0.05rem] bg-gray-300" />
        </div>
    );
};

export default function MarketDetailCard() {
    const { currentTicker, selectedMarket, krwNames } = useContext(TickerContext);

    const krwName = krwNames[selectedMarket];

    const color = currentTicker?.signed_change_rate < 0
        ? 'text-negative'
        : currentTicker?.signed_change_rate > 0
            ? 'text-positive'
            : 'text-black';

    return (
        <Card
            aria-label='코인 상세 정보 카드'
            className="w-full bg-white">
            <CardHeader className='flex justify-between'>
                {/* 종목 이름 */}
                <section className="flex flex-wrap gap-1 items-end">
                    <CardTitle className="text-2xl font-bold">{krwName}</CardTitle>
                    <h2>{currentTicker?.market}</h2>
                </section>

                {/* 52주 최고, 최저 */}
                <section>
                    <dl className={WEEKS_52_BOX_STYLE}>
                        <dt className={WEEKS_52_BOX_LABEL_STYLE}>
                            52주 최고
                        </dt>
                        <dd className={`${WEEKS_52_BOX_VALUE_STYLE} text-positive`}>
                            {currentTicker?.highest_52_week_price.toLocaleString()}
                        </dd>
                    </dl>
                    <dl className={WEEKS_52_BOX_STYLE}>
                        <dt className={WEEKS_52_BOX_LABEL_STYLE}>
                            52주 최저
                        </dt>
                        <dd className={`${WEEKS_52_BOX_VALUE_STYLE} text-negative`}>
                            {currentTicker?.lowest_52_week_price.toLocaleString()}
                        </dd>
                    </dl>
                </section>
            </CardHeader>

            <div className="w-full h-[0.05rem] bg-slate-200" />

            {/* 현재가, 인디케이터, 거래량, 거래대금 */}
            <CardContent className="flex justify-between">
                <section className={`flex flex-col justify-center ${color}`}>
                    <dl className="flex items-end">
                        {/* 현재가 */}
                        <dt className="text-2xl font-bold">
                            {Number(currentTicker?.trade_price).toLocaleString()}
                        </dt>
                        <dd>KRW</dd>
                    </dl>
                    <dl className="flex justify-between gap-2 items-center">
                        <dt className="text-[0.75rem] text-market-code font-bold">
                            전일대비
                        </dt>
                        {/* 전일대비 변화율 */}
                        <dd   >
                            {Number(currentTicker?.signed_change_rate) > 0 ? '+' : ''}
                            {Number(currentTicker?.signed_change_rate * 100).toFixed(2)}%
                        </dd>
                        {/* 전일대비 가격 변화 */}
                        <dd>
                            {Number(currentTicker?.signed_change_price) < 0
                                ? '▼'
                                : Number(currentTicker?.signed_change_price) > 0
                                    ? '▲'
                                    : ''}
                            {Number(currentTicker?.signed_change_price).toLocaleString()}
                        </dd>
                    </dl>
                </section>

                {/* 보조 지표 */}
                <section className="hidden sm:flex gap-2">
                    <div className={SUB_INDICATORS_COLUMN_STYLE}>
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
                    <div className={SUB_INDICATORS_COLUMN_STYLE}>
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
