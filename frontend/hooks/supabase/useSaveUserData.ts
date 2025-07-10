import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { userQuery } from '@/queries/supabase/user.query';
import { ISupabaseUser } from '@/types/supabase/user';

/** 서버에서 props 넘겨준 유저 데이터를 캐시에 저장하는 훅
 * @param user 유저 데이터
 * @returns { cachedUser: ISupabaseUser | null } 캐시에 저장된 유저 데이터
 */
export function useSaveUserData(user: ISupabaseUser | null) {
    const queryClient = useQueryClient();

    useEffect(() => {
        if (user) queryClient.setQueryData(userQuery.all(), user);
    }, [user, queryClient]);

    return { cachedUser: queryClient.getQueryData<ISupabaseUser | null>(userQuery.all()) };
}