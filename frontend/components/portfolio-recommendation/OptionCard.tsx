import React from 'react';
import Button from '@/components/shared/Button';

interface OptionCardProps {
    title: string;
    selected: boolean;
    onClick: () => void;
}

const OptionCard: React.FC<OptionCardProps> = ({ title, selected, onClick }) => {
    return (
        <Button
            type="button"
            onClick={onClick}
            customClassName={`w-full py-6 flex flex-col gap-2 border ${selected ? 'border-main bg-main/20' : 'border-slate-300 bg-white'} hover:shadow-lg`}
        >
            <span className="text-xl font-bold text-main">{title}</span>
        </Button>
    );
};

export default OptionCard; 