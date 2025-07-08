'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { getUserData } from '@/actions/supabase/getUserData';
import { userQuery } from '@/queries/supabase/user.query';
import { ISupabaseUser } from '@/types/supabase/user';

/**
 * 현재 로그인한 유저의 계정 정보를 조회하는 커스텀 훅
 * @returns { user: IUser | null, isError: boolean, error: unknown }
 */
export function useFetchUserData() {
    const { data, isError, error } = useSuspenseQuery({
        queryKey: userQuery.all(),
        queryFn: getUserData,
    });

    return { user: data as ISupabaseUser | null, isError, error };
}
