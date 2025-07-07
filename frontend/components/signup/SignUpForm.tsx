'use client';

import { useSignUpMutation } from '@/hooks/api/useSignupMutation';
import { useVerifyCodeMutation } from '@/hooks/api/useVerifyCodeMutation';
import { useForm } from 'react-hook-form';
import { escapeForXSS } from '@/utils/shared/escapeForXSS';
import { zodResolver } from '@hookform/resolvers/zod';
import { signUpFormSchema, SignUpFormSchemaType } from '@/schema/signUpFormSchema';
import React, { useState } from 'react';
import InputField from '@/components/shared/InputField';
import Button from '@/components/shared/Button';
import CodeForm from '@/components/signup/CodeForm';

export default function SignUpForm() {
    const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [code, setCode] = useState('');
    const [email, setEmail] = useState('');

    const {
        register,
        handleSubmit,
        formState: { isSubmitting, errors },
    } = useForm<SignUpFormSchemaType>({
        resolver: zodResolver(signUpFormSchema),
    });

    const { signUp } = useSignUpMutation();
    const { verifyCode } = useVerifyCodeMutation();

    const onSubmit = async (data: SignUpFormSchemaType) => {
        try {
            await signUp({
                email: escapeForXSS(data.email),
                password: escapeForXSS(data.password).trim(),
            });
            setEmail(data.email);
            setIsSubmitSuccess(true);
        } catch (error) {
            setIsSubmitSuccess(false);
            console.error(error);
        }
    };

    const handleVerifyCode = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await verifyCode({ email, code });
            alert('회원가입이 완료되었습니다!');
        } catch (error) {
            alert('인증 실패! 인증번호를 확인해주세요');
            console.error(error);
        }
    };

    return (
        <form
            onSubmit={isSubmitSuccess ? handleVerifyCode : handleSubmit(onSubmit)}
            className="w-full h-full p-4 border-1 border-slate-200 shadow-sm rounded-md flex flex-col gap-4" >
            {isSubmitSuccess ? <h1 className='text-3xl font-bold text-center'>인증 코드 입력</h1> : <h1 className='text-3xl font-bold text-center'>회원가입</h1>}
            {isSubmitSuccess ? <CodeForm code={code} setCode={setCode} /> : (
                <>
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
                </>
            )}
            <Button
                type="submit"
                variant="default"
                disabled={isSubmitting}
            >
                {isSubmitSuccess
                    ?
                    '인증하기'
                    : isSubmitting
                        ? '가입 처리 중...'
                        : '가입하기'}
            </Button>
        </form>
    );
}