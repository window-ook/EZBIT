'use client';

import { useEffect, useState } from 'react';
import { createBrowserSupabaseClient } from '@/utils/supabase/client';
import { CONSOLE_ERROR } from '@/utils/constants/messages';
import ResetPasswordRequestForm from '@/components/reset-password/ResetPasswordRequestForm';
import ResetPassWordForm from '@/components/reset-password/ResetPasswordForm';

export default function ResetPasswordContainer() {
    const supabase = createBrowserSupabaseClient();

    const [hasSession, setHasSession] = useState<boolean | null>(null);

    useEffect(() => {
        const checkSession = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                setHasSession(!!session?.access_token);
            } catch (error) {
                console.error(CONSOLE_ERROR.CHECK_RESET_PASSWORD_SESSION_FAIL, error);
                setHasSession(false);
            }
        };

        checkSession();
    }, [supabase]);

    if (hasSession === null) {
        return (
            <div className="size-full p-4 border-1 border-slate-200 shadow-sm rounded-md bg-white flex flex-col gap-4 items-center justify-center">
                <div className="size-8 border-b-2 rounded-full border-main animate-spin"></div>
                <p className="text-subtitle">로딩 중...</p>
            </div>
        );
    }

    return hasSession ? <ResetPassWordForm /> : <ResetPasswordRequestForm />;
} 