'use client';

import { ReactNode, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { createBrowserSupabaseClient } from 'utils/supabase/client';

interface IAuthProvider {
    children: ReactNode;
}

const AUTH_PAGES = ['/signin', '/signup', '/reset-password', '/reset-password/complete', '/auth/callback'];

export default function AuthProvider({ children }: IAuthProvider) {
    const supabase = createBrowserSupabaseClient();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const { data: { subscription: authListner } } = supabase.auth.onAuthStateChange((event, session) => {
            const isAuthPage = AUTH_PAGES.some(page => pathname.startsWith(page));
            const isPasswordRecovery = event === 'PASSWORD_RECOVERY' || pathname.startsWith('/reset-password');

            if (isPasswordRecovery) {
                if (event === 'PASSWORD_RECOVERY' && pathname !== '/reset-password') router.replace('/reset-password');
                return;
            }

            if (!session && !isAuthPage) {
                const callbackUrl = encodeURIComponent(pathname);
                router.replace(`/signin?callbackUrl=${callbackUrl}`);
            }

            if (session && isAuthPage && pathname !== '/auth/callback') router.replace('/exchange');
        });

        return () => authListner.unsubscribe();
    }, [supabase, router, pathname]);

    return children;
}