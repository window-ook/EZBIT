import { Card } from '@/components/shadcn-ui/card';
import React from 'react';
import Slider from '@/components/shared/Slider';
import Button from '@/components/shared/Button';

export interface Coin {
    name: string;
    code: string;
    rate?: number;
}

interface OptionDetailProps {
    title: string;
    description: string;
    tendency: string;
    amount: number;
    minAmount: number;
    maxAmount: number;
    onAmountChange: (value: number) => void;
    onBuy: () => void;
}

const OptionDetail: React.FC<OptionDetailProps> = ({
    title,
    description,
    tendency,
    amount,
    minAmount,
    maxAmount,
    onAmountChange,
    onBuy,
}) => {
    return (
        <Card className="flex flex-col gap-2 p-4">
            <span className="text-2xl font-bold text-main">{title}</span>
            <div className="text-lg font-medium text-gray-600">{description}</div>
            <div className="text-description">{tendency}</div>
            <div className="flex items-center gap-4">
                <Slider
                    min={minAmount}
                    max={maxAmount}
                    step={1000}
                    value={[amount]}
                    onValueChange={([v]) => onAmountChange(v)}
                    className="w-48"
                />
                <span className="text-lg font-bold text-main whitespace-nowrap">{amount.toLocaleString()}원</span>
            </div>
            <Button
                text="매수"
                onClick={onBuy}
                customClassName='py-6'
            />
        </Card>
    );
};

export default OptionDetail; 