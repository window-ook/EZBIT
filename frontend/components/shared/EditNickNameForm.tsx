'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUpdateNickName } from '@/hooks/supabase/users/useUpdateNickName';
import { changeNickNameSchema, ChangeNickNameSchemaType } from '@/schema/changeNickNameSchema';
import { Check, X, Edit3 } from 'lucide-react';

interface IEditNickNameForm {
    currentName: string;
    onSuccess?: () => void;
}

/** 닉네임 수정 폼
 * @param currentName 현재 닉네임
 * @param onSuccess 닉네임 수정 성공 시 호출되는 콜백 함수
*/
export default function EditNickNameForm({ currentName, onSuccess }: IEditNickNameForm) {
    const [isEditing, setIsEditing] = useState(false);
    const { updateNickName, isPending } = useUpdateNickName();

    const {
        register,
        handleSubmit,
        formState: { errors, isValid, isSubmitting },
        reset,
        watch
    } = useForm<ChangeNickNameSchemaType>({
        resolver: zodResolver(changeNickNameSchema),
        defaultValues: {
            nickname: currentName
        },
        mode: 'onChange'
    });

    const currentNickname = watch('nickname');

    const onSubmit = async (data: ChangeNickNameSchemaType) => {
        try {
            await updateNickName(data.nickname);
            setIsEditing(false);
            onSuccess?.();
        } catch (err) {
            console.error('닉네임 업데이트 실패:', err);
        }
    };

    const handleCancel = () => {
        reset({ nickname: currentName });
        setIsEditing(false);
    };

    if (!isEditing) {
        return (
            <div className="flex items-center gap-2">
                <span data-testid="current-nickname" className="font-medium text-sm text-main">
                    {currentName}
                </span>
                <button
                    type="button"
                    aria-label='닉네임 수정 버튼'
                    onClick={() => setIsEditing(true)}
                    className="hover-button p-1 rounded"
                >
                    <Edit3 className="size-3 text-main" />
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
            <div className="flex items-center gap-1">
                <input
                    type="text"
                    {...register('nickname')}
                    className="w-1/2 px-2 py-1 border border-white/30 rounded placeholder-main/70 focus:outline-none focus:ring-1 focus:ring-main flex-1 bg-white/20 text-sm text-main"
                    placeholder="닉네임을 입력하세요"
                    maxLength={20}
                    disabled={isPending || isSubmitting}
                    autoFocus
                />
                <button
                    type="submit"
                    aria-label='닉네임 수정 완료 버튼'
                    disabled={isPending || isSubmitting || !isValid || !currentNickname?.trim()}
                    className="hover-button p-1 rounded disabled:opacity-50"
                >
                    <Check className="size-3 text-main" />
                </button>
                <button
                    type="button"
                    aria-label='닉네임 수정 취소 버튼'
                    onClick={handleCancel}
                    disabled={isPending || isSubmitting}
                    className="hover-button p-1 rounded disabled:opacity-50"
                >
                    <X className="size-3 text-main" />
                </button>
            </div>
            {errors.nickname && (
                <span className="text-xs text-error" data-testid="nickname-error">
                    {errors.nickname.message}
                </span>
            )}
        </form>
    );
}