import React from 'react';
import Button from '@/components/shared/Button';

interface IOptionCard {
    title: string;
    selected: boolean;
    onClick: () => void;
}

export default function OptionButton({ title, selected, onClick }: IOptionCard) {
    return (
        <Button
            type="button"
            ariaLabel={`${title} 옵션 선택 버튼`}
            onClick={onClick}
            customClassName={`w-full py-6 flex flex-col gap-2 border ${selected ? 'border-main bg-main/20' : 'border-slate-300 bg-white'} hover:shadow-lg`}
        >
            <span className="text-sm md:text-xl font-bold text-main">{title}</span>
        </Button>
    );
};