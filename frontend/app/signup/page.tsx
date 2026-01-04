import { Metadata } from 'next';
import { UserPlus } from 'lucide-react';
import SignUpForm from '@/components/signup/SignUpForm';

export const metadata: Metadata = {
    title: '회원가입 : EZBIT',
    description: '회원가입 페이지 입니다',
};

export default function SignUpPage() {
    return (
        <main className='size-full pt-28 flex flex-col items-center justify-center gap-4'>
            <UserPlus className='size-20 text-main' />
            <section className='w-[20rem] md:w-[32rem]'>
                <SignUpForm />
            </section>
        </main>
    );
}