import { Metadata } from 'next';
import { CheckCircle } from 'lucide-react';
import ResetPasswordCompleteForm from '@/components/reset-password/ResetPasswordCompleteForm';

export const metadata: Metadata = {
    title: '비밀번호 변경 완료 : EZBIT',
    description: '비밀번호가 성공적으로 변경되었습니다',
};

export default function ResetPasswordCompletePage() {
    return (
        <main className='size-full pt-28 flex flex-col items-center justify-center gap-4'>
            <CheckCircle className='size-20 text-green-500' />
            <section className='w-[20rem] md:w-[32rem] rounded-lg shadow-md'>
                <ResetPasswordCompleteForm />
            </section>
        </main>
    );
} 