'use client';

import React from 'react';

type ButtonVariant = 'default' | 'cancel' | 'disabled';

interface IButton {
    type?: 'button' | 'submit';
    text?: string;
    variant?: ButtonVariant;
    disabled?: boolean;
    customClassName?: string;
    onClick?: () => void | Promise<void>;
    children?: React.ReactNode;
}

/**
 * 프로젝트 공통 버튼 - 모임 만들기, 모임 상세, 마이페이지, 로그인, 회원가입...
 * @param type 버튼 타입
 * @param text 버튼 텍스트
 * @param variant 버튼 변형
 * @param disabled 버튼 비활성화 여부
 */
export default function Button({
    type = 'button',
    text,
    variant = 'default',
    disabled = false,
    customClassName = '',
    onClick,
    children,
}: IButton) {
    const getVariantClasses = (variant: ButtonVariant): string => {
        const baseClasses = 'hover-button px-4 py-2 rounded-lg font-semibold disabled:bg-button-disabled bg-button text-button-text disabled:cursor-not-allowed';
        switch (variant) {
            case 'default':
                return `${baseClasses}`;
            case 'cancel':
                return `bg-transparent text-button border border-main hover:text-button-text ${baseClasses}`;
            case 'disabled':
                return `bg-button-disabled ${baseClasses}`;
            default:
                return `${baseClasses}`;
        }
    };

    const finalClassName = `${customClassName} ${getVariantClasses(variant)}`;
    const isClickDisabled = disabled || variant === 'disabled';

    return (
        <button
            type={type}
            disabled={isClickDisabled}
            onClick={onClick}
            className={finalClassName}
        >
            {text || children}
        </button>
    );
}
