'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/shared/Button';

export default function ResetPasswordCompleteClient() {
    const router = useRouter();

    // 페이지 로드 시 5초 후 자동으로 로그인 페이지로 이동
    useEffect(() => {
        const timer = setTimeout(() => {
            router.push('/signin');
        }, 5000);

        return () => clearTimeout(timer);
    }, [router]);

    const handleGoToLogin = () => {
        router.push('/signin');
    };

    return (
        <div className="w-full h-full p-4 border-1 border-slate-200 shadow-sm rounded-md bg-white flex flex-col gap-4 text-center">
            <h1 className='text-3xl font-bold text-center text-green-600'>
                비밀번호 변경 완료
            </h1>

            <div className="space-y-4">
                <p className="text-gray-700">
                    비밀번호가 성공적으로 변경되었습니다.
                </p>

                <p className="text-sm text-gray-500">
                    보안을 위해 모든 기기에서 로그아웃되었습니다.<br />
                    새로운 비밀번호로 다시 로그인해주세요.
                </p>

                <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                    <p className="text-sm text-blue-700">
                        💡 앞으로는 더욱 안전한 비밀번호를 사용해주세요.
                    </p>
                </div>

                <p className="text-xs text-gray-400">
                    5초 후 자동으로 로그인 페이지로 이동합니다.
                </p>
            </div>

            <Button
                type="button"
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