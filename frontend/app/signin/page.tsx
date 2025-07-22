import { Metadata } from 'next';
import { Lock } from 'lucide-react';
import Link from 'next/link';
import SignInForm from '@/components/signin/SignInForm';

export const metadata: Metadata = {
    title: '로그인 : EZBIT',
    description: '로그인 페이지 입니다',
};

export default function SignInPage() {
    return (
        <main className='size-full pt-28 flex flex-col items-center justify-center gap-4'>
            <Lock className='size-20 text-main' />
            <section className='w-[20rem] md:w-[32rem] rounded-lg shadow-md'>
                <SignInForm />
            </section>
            <section className='flex gap-1 justify-center text-lg'>
                <span className='text-description'>비밀번호를 잊으셨나요?</span>
                <Link
                    aria-label='비밀번호 재설정 링크'
                    href='/reset-password'
                    className='text-blue-500 cursor-pointer hover:underline'
                >
                    재설정하기
                </Link>
            </section>
        </main>
    );
}