'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserSupabaseClient } from 'utils/supabase/client';

interface IGuestOnlyProvider {
    children: ReactNode;
}

export default function GuestOnlyProvider({ children }: IGuestOnlyProvider) {
    const supabase = createBrowserSupabaseClient();
    const router = useRouter();

    useEffect(() => {
        const { data: { subscription: authListner } } = supabase.auth.onAuthStateChange((_, session) => {
            if (session) router.replace('/exchange');
        });

        return () => authListner.unsubscribe();
    }, [supabase, router]);

    return children;
}
