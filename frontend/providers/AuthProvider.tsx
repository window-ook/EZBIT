'use client';

import { ReactNode, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { createBrowserSupabaseClient } from 'utils/supabase/client';

interface IAuthProvider {
    accessToken: string | null;
    children: ReactNode;
}

const RULES = [
    { path: '/signin', requireAuth: false, blockIfAuth: true },
    { path: '/signup', requireAuth: false, blockIfAuth: true },
    { path: '/reset-password', requireAuth: false, blockIfAuth: true },
    { path: '/reset-password/complete', requireAuth: false, blockIfAuth: true },
    { path: '/auth/callback', requireAuth: false, blockIfAuth: true },
    { path: '/history', requireAuth: true, blockIfAuth: false },
    { path: '/my-assets', requireAuth: true, blockIfAuth: false },
];

const matchRule = (pathname: string) => RULES.find(rule => pathname === rule.path);

export default function AuthProvider({ children }: IAuthProvider) {
    const supabase = createBrowserSupabaseClient();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const { data: { subscription: authListner } } = supabase.auth.onAuthStateChange((event, session) => {
            const rule = matchRule(pathname);

            // 비밀번호 재설정 이메일 링크로 접근한 경우만 예외 처리
            const isPasswordRecoveryFlow = event === 'PASSWORD_RECOVERY' ||
                (typeof window !== 'undefined' && window.location.search.includes('type=recovery'));

            // 비밀번호 재설정 이메일 링크로 접근한 경우
            if (isPasswordRecoveryFlow) {
                if (event === 'PASSWORD_RECOVERY' && pathname !== '/reset-password') router.replace('/reset-password');
                return;
            }

            // 라우팅
            if (!session && rule?.requireAuth) router.replace('/signin');
            if (session && rule?.blockIfAuth) router.replace('/exchange');
        });

        return () => authListner.unsubscribe();
    }, [supabase, router, pathname]);

    return children;
}