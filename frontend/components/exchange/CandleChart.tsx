'use client';

import { useState, useEffect, useContext, useCallback, useMemo } from 'react';
import { useCandles } from '@/hooks/upbit/useCandles';
import { TickerContext } from '@/providers/TickerProvider';
import { Card } from '@/components/shadcn-ui/card';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';

if (typeof window !== 'undefined') {
    try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const indicatorsModule = require('highcharts/indicators/indicators');
        if (typeof indicatorsModule === 'function') {
            indicatorsModule(Highcharts);
            console.log('Indicators loaded successfully');
        }
    } catch (error) {
        console.warn('Failed to load indicators:', error);
    }
}

Highcharts.setOptions({
    lang: {
        rangeSelectorZoom: '기간',
    },
});

const initialOptions = {
    chart: {
        maxWidth: 900,
        height: 400,
        zooming: {
            mouseWheel: {
                enabled: true,
                sensitivity: 1.3,
            },
        },
    },
    accessibility: { enabled: false },
    credits: { enabled: true, text: 'EZBIT' },
    navigator: { enabled: true },
    yAxis: [
        {
            labels: {
                align: 'right',
                x: -4,
                formatter: function (this: { value: number }) {
                    return Highcharts.numberFormat(Number(this.value), 0, '', ',');
                },
            },
            height: '80%',
            lineWidth: 2,
            crosshair: { snap: false },
        },
        {
            labels: { align: 'right', x: -3 },
            top: '80%',
            height: '20%',
            offset: 0,
            lineWidth: 2,
        },
    ],
    plotOptions: {
        candlestick: {
            color: 'oklch(0.44 0.293689 264.162)',
            upColor: 'oklch(0.6 0.2461 29.23)',
        },
        sma: {
            linkedTo: 'upbit',
            lineWidth: 0.8,
            zIndex: 1,
            marker: { enabled: false },
            enableMouseTracking: false,
        },
    },
    tooltip: {
        shared: true,
        style: { fontSize: '0.75rem' },
        backgroundColor: 'oklch(0.99 0 0)',
        borderRadius: 4,
        borderWidth: 1,
        shadow: false,
    },
};

const DEFAULT_TYPE = '1min';
const DEFAULT_UNIT = 1;
const DEFAULT_COUNT = 200;

export default function CandleChart() {
    const { selectedMarket } = useContext(TickerContext);

    const [options, setOptions] = useState(initialOptions);
    const [type, setType] = useState<string>(DEFAULT_TYPE);
    const [unit, setUnit] = useState<number>(DEFAULT_UNIT);
    const [count] = useState<number>(DEFAULT_COUNT);
    const [to] = useState<string | undefined>(undefined);

    const handleTypeChange = useCallback((newType: string, newUnit?: number) => {
        setType(newType);
        if (newUnit) setUnit(newUnit);
    }, []);

    const { candles } = useCandles({
        type,
        ticker: selectedMarket,
        count,
        unit: type.endsWith('min') ? unit : undefined,
        to,
    });

    // rangeSelector를 useMemo로 최적화
    const rangeSelector = useMemo(() => ({
        allButtonsEnabled: true,
        inputEnabled: false,
        buttons: [
            {
                text: '1분봉',
                events: {
                    click: () => handleTypeChange('1min', 1),
                },
            },
            {
                text: '5분봉',
                events: {
                    click: () => handleTypeChange('5min', 5),
                },
            },
            {
                text: '일봉',
                events: {
                    click: () => handleTypeChange('days'),
                },
            },
            {
                text: '주봉',
                events: {
                    click: () => handleTypeChange('weeks'),
                },
            },
            {
                text: '월봉',
                events: {
                    click: () => handleTypeChange('months'),
                },
            },
        ],
    }), [handleTypeChange]);

    // useEffect로 데이터가 변경될 때마다 차트 옵션 업데이트
    useEffect(() => {
        if (!candles || !Array.isArray(candles) || candles.length === 0) return;

        // 데이터 정렬 및 가공
        const sorted = [...candles].sort((a, b) => a.timestamp - b.timestamp);

        const ohlc = sorted.map(candle => [
            candle.timestamp,
            candle.opening_price,
            candle.high_price,
            candle.low_price,
            candle.trade_price,
        ]);

        const minTimestamp = ohlc[0][0];
        const maxTimestamp = ohlc[ohlc.length - 1][0];

        const volume = sorted.map(candle => ({
            x: candle.timestamp,
            y: candle.candle_acc_trade_volume,
            color:
                candle.opening_price <= candle.trade_price
                    ? 'oklch(0.76 0.1467 351.66)'
                    : 'oklch(0.93 0.0805 197.79)',
        }));

        // 차트 옵션 부분 업데이트
        setOptions(prevOptions => ({
            ...prevOptions,
            // x축 범위 설정
            xAxis: {
                min: minTimestamp,
                max: maxTimestamp,
            },
            // 범위 셀렉터
            rangeSelector,
            // 시리즈 데이터
            series: [
                // 캔들스틱 차트
                {
                    type: 'candlestick',
                    name: selectedMarket,
                    id: 'upbit',
                    data: ohlc,
                },
                // 15일 이동평균선
                {
                    type: 'sma',
                    params: { period: 15 },
                    color: 'oklch(0.57 0.2301 27.32)',
                },
                // 50일 이동평균선
                {
                    type: 'sma',
                    params: { period: 50 },
                    color: 'oklch(0.87 0.2414 149.42)',
                },
                // 거래량 막대 차트
                {
                    type: 'column',
                    name: '누적 거래량',
                    data: volume,
                    yAxis: 1,
                },
            ],
        }));
    }, [candles, selectedMarket, rangeSelector]);

    return (
        <Card>
            <HighchartsReact
                highcharts={Highcharts}
                constructorType={'stockChart'}
                options={options}
            />
        </Card>
    );
}