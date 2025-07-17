'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { userQuery } from '@/queries/supabase/user.query';
import { getUser } from '@/actions/supabase/getUser';

/**
 * 유저 정보를 조회하는 커스텀 훅
 * @queryFn getUser: 유저 정보 조회 서버 액션
 * @returns {data, isError, error}
 */
export function useUser() {
    const { data, isError, error } = useSuspenseQuery({
        queryKey: userQuery.all(),
        queryFn: () => getUser(),
    });

    return { user: data, isError, error };
}