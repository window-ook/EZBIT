'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSignInByEmail } from '@/hooks/supabase/authentication/useSignInByEmail';
import { escapeForXSS } from '@/utils/shared/escapeForXSS';
import { zodResolver } from '@hookform/resolvers/zod';
import { signInFormSchema, SignInFormSchemaType } from '@/schema/signInFormSchema';
import { CONSOLE_ERROR } from '@/constants/messages';
import InputField from '@/components/shared/InputField';
import Button from '@/components/shared/Button';
import GoogleOauthButton from '@/components/shared/GoogleOauthButton';

export default function SignInForm() {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { isSubmitting, errors },
        setError,
    } = useForm<SignInFormSchemaType>({
        resolver: zodResolver(signInFormSchema),
    });

    const signInMutation = useSignInByEmail();

    const onSubmit = async (data: SignInFormSchemaType) => {
        try {
            await signInMutation.mutateAsync({
                email: escapeForXSS(data.email),
                password: escapeForXSS(data.password).trim(),
            });
        } catch (error) {
            console.error(CONSOLE_ERROR.SIGNIN_FAIL, error);
            setError('root', {
                type: 'manual',
                message: '이메일 또는 비밀번호가 올바르지 않습니다.',
            });
        }
    };

    return (
        <form
            aria-label='로그인 폼'
            onSubmit={handleSubmit(onSubmit)}
            className="size-full p-4 border-1 shadow-md rounded-3xl bg-white flex flex-col gap-4" >
            <h1 className='text-3xl font-bold text-center'>로그인</h1>
            <InputField
                label="이메일"
                type="email"
                id="email"
                placeholder='이메일을 입력해주세요'
                {...register('email')}
                disabled={false}
                isError={errors.email?.message}
            />
            <InputField
                label="비밀번호"
                type="password"
                id="password"
                placeholder='비밀번호를 입력해주세요'
                {...register('password')}
                handlePasswordVisibility={() => setIsPasswordVisible((v) => !v)}
                isPasswordVisible={isPasswordVisible}
                disabled={false}
                isError={errors.password?.message}
            />
            {errors.root && (
                <div className="text-red-500 text-sm text-center p-2 bg-red-50 rounded-md border border-red-200">
                    {errors.root.message}
                </div>
            )}
            <Button
                type="submit"
                variant="default"
                disabled={isSubmitting || signInMutation.isPending}
                customClassName='hover:brightness-110'
            >
                {signInMutation.isPending ? '로그인 중...' : '로그인'}
            </Button>
            <GoogleOauthButton />
        </form>
    );
}