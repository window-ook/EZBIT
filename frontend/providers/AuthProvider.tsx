'use client';

import { ReactNode, useEffect, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { createBrowserSupabaseClient } from '@/utils/supabase/client';
import { userQuery } from '@/queries/supabase/users.query';

export interface IAuthProvider {
    children: ReactNode;
}

export default function AuthProvider({ children }: IAuthProvider) {
    const supabase = useMemo(() => createBrowserSupabaseClient(), []);
    const queryClient = useQueryClient();

    useEffect(() => {
        const {
            data: { subscription: authListener },
        } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (session?.user) {
                // 로그인 시 user 쿼리 무효화하여 최신 데이터 가져오기
                queryClient.invalidateQueries({ queryKey: userQuery.all() });
            } else {
                // 로그아웃 시 user 쿼리 초기화
                queryClient.resetQueries({ queryKey: userQuery.all() });
            }
        });

        return () => {
            authListener.unsubscribe();
        };
    }, [supabase, queryClient]);

    return children;
}
