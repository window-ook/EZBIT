'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resetPasswordCompleteSchema, ResetPasswordCompleteSchemaType } from '@/schema/resetPasswordSchema';
import { useFinishResetPassword } from '@/hooks/supabase/authentication/useFinishResetPassword';
import { escapeForXSS } from '@/utils/shared/escapeForXSS';
import InputField from '@/components/shared/InputField';
import Button from '@/components/shared/Button';
import { CONSOLE_ERROR } from '@/constants/messages';

export default function ResetPasswordForm() {
    const router = useRouter();

    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        watch
    } = useForm<ResetPasswordCompleteSchemaType>({
        resolver: zodResolver(resetPasswordCompleteSchema),
        mode: 'onChange'
    });

    const { finishReset, isPending } = useFinishResetPassword();

    const watchedPassword = watch('newPassword');
    const watchedConfirmPassword = watch('confirmPassword');

    const onSubmit = async (data: ResetPasswordCompleteSchemaType) => {
        try {
            finishReset(escapeForXSS(data.newPassword));
        } catch (error) {
            console.error(CONSOLE_ERROR.SUBMIT_RESET_PASSWORD_FAIL, error);
        }
    };

    const handleCancel = () => {
        if (confirm('비밀번호 재설정을 취소하시겠습니까? 로그인 페이지로 이동합니다.')) router.push('/signin');
    };

    return (
        <form
            aria-label='새 비밀번호 설정 폼'
            onSubmit={handleSubmit(onSubmit)}
            className="size-full p-4 border-1 border-slate-200 shadow-sm rounded-md bg-white flex flex-col gap-4"
        >
            <h1 className='text-3xl font-bold text-center'>새 비밀번호 설정</h1>
            <p className="text-center text-subtitle text-sm">새로운 비밀번호를 입력해주세요.</p>

            <InputField
                label="새 비밀번호"
                type="password"
                id="newPassword"
                placeholder='새 비밀번호를 입력해주세요'
                {...register('newPassword')}
                handlePasswordVisibility={() => setIsPasswordVisible((v) => !v)}
                isPasswordVisible={isPasswordVisible}
                disabled={isPending}
                isError={errors.newPassword?.message}
                aria-label="새 비밀번호 입력"
            />

            <InputField
                label="새 비밀번호 확인"
                type="password"
                id="confirmPassword"
                placeholder='새 비밀번호를 다시 입력해주세요'
                {...register('confirmPassword')}
                handlePasswordVisibility={() => setIsConfirmPasswordVisible((v) => !v)}
                isPasswordVisible={isConfirmPasswordVisible}
                disabled={isPending}
                isError={errors.confirmPassword?.message}
                aria-label="새 비밀번호 확인 입력"
            />

            {watchedPassword && watchedConfirmPassword && (
                <div className={`text-sm ${watchedPassword === watchedConfirmPassword
                    ? 'text-success'
                    : 'text-error'
                    }`}>
                    {watchedPassword === watchedConfirmPassword
                        ? '✓ 비밀번호가 일치합니다'
                        : '✗ 비밀번호가 일치하지 않습니다'
                    }
                </div>
            )}

            <Button
                type="submit"
                ariaLabel='새 비밀번호 설정 완료 버튼'
                variant="default"
                disabled={isPending || !isValid}
                aria-label="새 비밀번호 설정 완료 버튼"
                customClassName='hover:bg-button-hover'
            >
                {isPending ? '변경 중...' : '비밀번호 변경'}
            </Button>

            <Button
                type="button"
                ariaLabel='새 비밀번호 설정 취소 버튼'
                variant="default"
                onClick={handleCancel}
                disabled={isPending}
                customClassName='hover:bg-button-hover'
            >
                취소
            </Button>
        </form>
    );
} 