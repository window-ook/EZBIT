'use client';

import { useQuery } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';
import { userQuery } from '@/queries/supabase/users.query';
import { getUserData } from '@/actions/supabase/users/getUserData';

/**
 * 유저 정보를 조회하는 훅
 * @returns {user, isPending, isError, error}
 */
export function useUserData() {
    const pathname = usePathname();

    // 비밀번호 재설정 페이지에서는 쿼리 비활성화
    const isResetPasswordPage = pathname === '/reset-password';

    const { data, isPending, isError, error } = useQuery({
        queryKey: userQuery.all(),
        queryFn: getUserData,
        enabled: !isResetPasswordPage,
    });

    return { user: data, isPending, isError, error };
}