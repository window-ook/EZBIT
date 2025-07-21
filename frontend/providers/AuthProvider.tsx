'use client';

import { ReactNode, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { createBrowserSupabaseClient } from 'utils/supabase/client';

interface IAuthProvider {
    children: ReactNode;
}

const RULES = [
    { path: '/signin', requireAuth: false, blockIfAuth: true },
    { path: '/signup', requireAuth: false, blockIfAuth: true },
    { path: '/signup/confirm', requireAuth: false, blockIfAuth: true },
    { path: '/reset-password', requireAuth: false, blockIfAuth: true },
    { path: '/reset-password/complete', requireAuth: false, blockIfAuth: true },
    { path: '/history', requireAuth: true, blockIfAuth: false },
    { path: '/auto-portfoilo', requireAuth: true, blockIfAuth: false },
    { path: '/auto-portfolilo/result', requireAuth: true, blockIfAuth: false },
    { path: '/my-profile', requireAuth: true, blockIfAuth: false },
    { path: '/my-assets', requireAuth: true, blockIfAuth: false },
];

const matchRule = (pathname: string) => RULES.find(rule => pathname === rule.path);

export default function AuthProvider({
    children,
}: IAuthProvider) {
    const supabase = createBrowserSupabaseClient();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const { data: { subscription: authListner } } = supabase.auth.onAuthStateChange((_, session) => {
            const rule = matchRule(pathname);
            if (!session && rule?.requireAuth) router.replace('/signin');
            if (session && rule?.blockIfAuth) router.replace('/exchange');
        });

        return () => authListner.unsubscribe();
    }, [supabase, router, pathname]);

    return children;
}
