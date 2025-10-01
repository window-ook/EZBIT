'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/shared/Button';

export default function ResetPasswordCompleteForm() {
    const router = useRouter();

    useEffect(() => {
        const isValidAccess = sessionStorage.getItem('password-reset-completed');

        if (!isValidAccess) {
            router.replace('/signin');
            return;
        }

        sessionStorage.removeItem('password-reset-completed');

        const timer = setTimeout(() => router.push('/signin'), 5000);

        return () => clearTimeout(timer);
    }, [router]);

    const handleGoToLogin = () => router.push('/signin');

    return (
        <div className="size-full p-4 border-1 border-slate-200 shadow-sm rounded-md bg-white flex flex-col gap-4 text-center">
            <h1 className='text-3xl font-bold text-center text-success'>
                비밀번호 변경 완료
            </h1>

            <div className="space-y-4">
                <p className="text-subtitle">
                    비밀번호가 성공적으로 변경되었습니다.
                </p>

                <p className="text-sm text-subtitle">
                    보안을 위해 모든 기기에서 로그아웃되었습니다.<br />
                    새로운 비밀번호로 다시 로그인해주세요.
                </p>

                <div className="p-3 rounded-md bg-blue-50 border border-main">
                    <p className="text-sm text-main-dark">
                        💡 앞으로는 더욱 안전한 비밀번호를 사용해주세요.
                    </p>
                </div>

                <p className="text-xs text-description">
                    5초 후 자동으로 로그인 페이지로 이동합니다.
                </p>
            </div>

            <Button
                type="button"
                ariaLabel='로그인 페이지로 이동 버튼'
                variant="default"
                onClick={handleGoToLogin}
                customClassName="w-full"
                aria-label="로그인 페이지로 이동"
            >
                지금 로그인하기
            </Button>
        </div>
    );
} 