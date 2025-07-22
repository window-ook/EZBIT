import { Metadata } from 'next';
import { RotateCcwKey } from 'lucide-react';
import ResetPasswordContainer from '@/components/reset-password/ResetPasswordContainer';

export const metadata: Metadata = {
    title: '비밀번호 재설정 : EZBIT',
    description: '비밀번호를 재설정하는 페이지입니다',
};

export default function ResetPasswordPage() {
    return (
        <main className='w-full h-full pt-28 flex flex-col items-center justify-center gap-2'>
            <RotateCcwKey className='size-20 text-main' />
            <section className='w-[20rem] md:w-[32rem] rounded-lg shadow-md'>
                <ResetPasswordContainer />
            </section>
        </main>
    );
}

