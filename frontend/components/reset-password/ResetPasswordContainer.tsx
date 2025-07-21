'use client';

import { useEffect, useState } from 'react';
import { createBrowserSupabaseClient } from '@/utils/supabase/client';
import ResetPasswordForm from './ResetPasswordForm';
import ResetPasswordClient from './ResetPasswordClient';

export default function ResetPasswordContainer() {
    const [hasSession, setHasSession] = useState<boolean | null>(null);
    const supabase = createBrowserSupabaseClient();

    useEffect(() => {
        const checkSession = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                setHasSession(!!session?.access_token);
            } catch (error) {
                console.error('Error checking session:', error);
                setHasSession(false);
            }
        };

        checkSession();
    }, [supabase]);

    // 로딩 중일 때는 아무것도 렌더링하지 않음
    if (hasSession === null) {
        return (
            <div className="w-full h-full p-4 border-1 border-slate-200 shadow-sm rounded-md bg-white flex flex-col gap-4 items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-main"></div>
                <p className="text-gray-600">로딩 중...</p>
            </div>
        );
    }

    // 세션이 있으면 비밀번호 설정 폼, 없으면 이메일 입력 폼
    return hasSession ? <ResetPasswordClient /> : <ResetPasswordForm />;
} 