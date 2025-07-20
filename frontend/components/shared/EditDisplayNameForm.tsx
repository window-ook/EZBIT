'use client';

import React, { useState } from 'react';
import { useUpdateNickName } from '@/hooks/supabase/useUpdateNickName';
import { Check, X, Edit3 } from 'lucide-react';

interface EditDisplayNameFormProps {
    currentName: string;
    onSuccess: () => void;
}

export default function EditDisplayNameForm({ currentName, onSuccess }: EditDisplayNameFormProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [nickname, setNickname] = useState(currentName);
    const [error, setError] = useState('');

    const { updateNickName, isLoading } = useUpdateNickName();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            await updateNickName(nickname);
            setIsEditing(false);
            onSuccess();
        } catch (err) {
            setError(err instanceof Error ? err.message : '업데이트에 실패했습니다.');
        }
    };

    const handleCancel = () => {
        setNickname(currentName);
        setIsEditing(false);
        setError('');
    };

    if (!isEditing) {
        return (
            <div className="flex items-center gap-2">
                <span className="font-medium text-sm text-main">
                    {currentName}
                </span>
                <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="hover-button p-1 rounded"
                >
                    <Edit3 className="size-3 text-main" />
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <div className="flex items-center gap-1">
                <input
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    className="px-2 py-1 border border-white/30 rounded placeholder-main/70 focus:outline-none focus:ring-1 focus:ring-main flex-1 bg-white/20 text-sm text-main"
                    placeholder="닉네임을 입력하세요"
                    maxLength={20}
                    disabled={isLoading}
                    autoFocus
                />
                <button
                    type="submit"
                    disabled={isLoading || nickname.trim().length === 0}
                    className="hover-button p-1 rounded disabled:opacity-50"
                >
                    <Check className="size-3 text-main" />
                </button>
                <button
                    type="button"
                    onClick={handleCancel}
                    disabled={isLoading}
                    className="hover-button p-1 rounded disabled:opacity-50"
                >
                    <X className="size-3 text-main" />
                </button>
            </div>
            {error && (
                <span className="text-xs text-error">
                    {error}
                </span>
            )}
        </form>
    );
}