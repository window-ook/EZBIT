import { Metadata } from 'next';
import { Lock } from 'lucide-react';
import SignInForm from '@/components/signin/SignInForm';

export const metadata: Metadata = {
    title: '로그인 : EZBIT',
    description: '로그인 페이지 입니다',
};

export default function SignInPage() {
    return (
        <main className='w-full h-full pt-28 flex flex-col items-center justify-center gap-2'>
            <Lock className='size-20 text-main' />
            <section className='w-[20rem] md:w-[32rem] rounded-lg shadow-md'>
                <SignInForm />
            </section>
        </main>
    );
}