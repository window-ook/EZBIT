import * as React from 'react';
import * as RadixSlider from '@radix-ui/react-slider';

interface ISlider {
    min?: number;
    max?: number;
    step?: number;
    value: number[];
    onValueChange: (value: number[]) => void;
    className?: string;
    'aria-label'?: string;
    'aria-labelledby'?: string;
    'aria-describedby'?: string;
}

export default function Slider({
    min = 0,
    max = 100,
    step = 1,
    value,
    onValueChange,
    className,
    'aria-label': ariaLabel = '값 조정 슬라이더',
    'aria-labelledby': ariaLabelledby,
    'aria-describedby': ariaDescribedby
}: ISlider) {
    return (
        <RadixSlider.Root
            className={`relative flex items-center select-none touch-none w-full h-6 ${className || ''}`}
            min={min}
            max={max}
            step={step}
            value={value}
            onValueChange={onValueChange}
            aria-label={ariaLabelledby ? undefined : ariaLabel}
            aria-labelledby={ariaLabelledby}
            aria-describedby={ariaDescribedby}
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={value[0]}
        >
            <RadixSlider.Track className="bg-slate-200 relative grow rounded-full h-2">
                <RadixSlider.Range className="absolute bg-main rounded-full h-full" />
            </RadixSlider.Track>
            <RadixSlider.Thumb
                className="block w-5 h-5 bg-white border-2 border-main rounded-full shadow focus:outline-none focus:ring-2 focus:ring-main transition-all duration-200"
                aria-label={`슬라이더 조절, 현재 값: ${value[0]}`}
            />
        </RadixSlider.Root>
    );
};