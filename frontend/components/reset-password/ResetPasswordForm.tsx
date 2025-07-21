'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useResetPassword } from '@/hooks/supabase/useResetPassword';
import { zodResolver } from '@hookform/resolvers/zod';
import { resetPasswordRequestSchema, ResetPasswordRequestSchemaType } from '@/schema/reset-password/resetPasswordSchema';
import { escapeForXSS } from '@/utils/shared/escapeForXSS';
import InputField from '@/components/shared/InputField';
import Button from '@/components/shared/Button';

export default function ResetPasswordForm() {
    const [resetRequested, setResetRequested] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues
    } = useForm<ResetPasswordRequestSchemaType>({
        resolver: zodResolver(resetPasswordRequestSchema),
    });

    const { requestReset, isPending } = useResetPassword();

    const onSubmit = async (data: ResetPasswordRequestSchemaType) => {
        try {
            requestReset(escapeForXSS(data.email), () => {
                setResetRequested(true);
            });
        } catch (error) {
            console.error('비밀번호 재설정 요청 실패:', error);
        }
    };

    const handleBackToLogin = () => {
        setResetRequested(false);
    };

    if (resetRequested) {
        return (
            <div className="w-full h-full p-4 border-1 border-slate-200 shadow-sm rounded-md bg-white flex flex-col gap-4">
                <h1 className='text-3xl font-bold text-center'>이메일 확인</h1>
                <div className="text-center space-y-4">
                    <p className="text-gray-600">
                        <strong>{getValues('email')}</strong>로<br />
                        비밀번호 재설정 링크를 전송했습니다.
                    </p>
                    <p className="text-sm text-gray-500">
                        이메일을 확인하고 링크를 클릭하여<br />
                        비밀번호를 재설정해주세요.
                    </p>
                    <Button
                        type="button"
                        variant="default"
                        onClick={handleBackToLogin}
                        customClassName="w-full"
                    >
                        로그인으로 돌아가기
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full h-full p-4 border-1 border-slate-200 shadow-sm rounded-md bg-white flex flex-col gap-4"
        >
            <h1 className='text-3xl font-bold text-center'>비밀번호 재설정</h1>
            <p className="text-center text-gray-600 text-sm">
                가입하신 이메일을 입력해주세요.<br />
                비밀번호 재설정 링크를 전송해드립니다.
            </p>

            <InputField
                label="이메일"
                type="email"
                id="email"
                placeholder='이메일을 입력해주세요'
                {...register('email')}
                disabled={isPending}
                isError={errors.email?.message}
                aria-label="비밀번호 재설정을 위한 이메일 입력"
            />

            <Button
                type="submit"
                variant="default"
                disabled={isPending}
                aria-label="비밀번호 재설정 링크 메일 요청 버튼"
                customClassName='hover:bg-button-hover'
            >
                {isPending ? '전송 중...' : '재설정 링크 전송'}
            </Button>

            <Button
                type="button"
                variant="default"
                onClick={handleBackToLogin}
                disabled={isPending}
                customClassName='hover:bg-button-hover'
            >
                로그인으로 돌아가기
            </Button>
        </form>
    );
} 