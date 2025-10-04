'use client';

import { useQuery } from '@tanstack/react-query';
import { userQuery } from '@/queries/supabase/users.query';
import { getUserData } from '@/actions/supabase/users/getUserData';

/** 
 * 유저 정보를 조회하는 훅 
 * @returns {user, isPending, isError, error}
 */
export function useUserData() {
    const { data, isPending, isError, error } = useQuery({
        queryKey: userQuery.all(),
        queryFn: async () => {
            const result = await getUserData();
            if (!result.success) throw new Error(result.message || '유저 정보 조회에 실패했습니다.');
            return result.data;
        },
        enabled: true,
    });

    return { user: data, isPending, isError, error };
}