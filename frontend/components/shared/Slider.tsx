import * as React from 'react';
import * as RadixSlider from '@radix-ui/react-slider';

interface ISlider {
    min?: number;
    max?: number;
    step?: number;
    value: number[];
    onValueChange: (value: number[]) => void;
    className?: string;
}

export default function Slider({ min = 0, max = 100, step = 1, value, onValueChange, className }: ISlider) {
    return (
        <RadixSlider.Root
            className={`relative flex items-center select-none touch-none w-full h-6 ${className || ''}`}
            min={min}
            max={max}
            step={step}
            value={value}
            onValueChange={onValueChange}
        >
            <RadixSlider.Track className="bg-gray-200 relative grow rounded-full h-2">
                <RadixSlider.Range className="absolute bg-main rounded-full h-full" />
            </RadixSlider.Track>
            <RadixSlider.Thumb className="block w-5 h-5 bg-white border-2 border-main rounded-full shadow focus:outline-none focus:ring-2 focus:ring-main" />
        </RadixSlider.Root>
    );
};