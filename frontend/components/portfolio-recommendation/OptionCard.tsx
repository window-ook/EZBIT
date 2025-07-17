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
            customClassName={`w-full flex flex-col gap-2 ${selected ? 'bg-main-dark' : ''} hover:shadow-lg`}
        >
            <span className="text-xl font-bold text-white">{title}</span>
        </Button>
    );
};

export default OptionCard; 