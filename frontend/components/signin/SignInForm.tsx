'use client';

import { useSignIn } from '@/hooks/supabase/useSignin';
import { useForm } from 'react-hook-form';
import { escapeForXSS } from '@/utils/shared/escapeForXSS';
import { zodResolver } from '@hookform/resolvers/zod';
import { signInFormSchema, SignInFormSchemaType } from '@/schema/signin/signInFormSchema';
import React, { useState } from 'react';
import InputField from '@/components/shared/InputField';
import Button from '@/components/shared/Button';

export default function SignInForm() {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { isSubmitting, errors },
    } = useForm<SignInFormSchemaType>({
        resolver: zodResolver(signInFormSchema),
    });

    const { signIn } = useSignIn();

    const onSubmit = async (data: SignInFormSchemaType) => {
        try {
            await signIn({
                email: escapeForXSS(data.email),
                password: escapeForXSS(data.password).trim(),
            });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full h-full p-4 border-1 border-slate-200 shadow-sm rounded-md bg-white flex flex-col gap-4" >
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
            <Button
                type="submit"
                variant="default"
                disabled={isSubmitting}
            >
                로그인
            </Button>
        </form>
    );
}