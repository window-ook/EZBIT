'use client';

import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { userQuery } from '@/queries/supabase/users.query';
import { getUserData } from '@/actions/supabase/users/getUserData';

/** 유저 정보를 조회하는 훅 (Suspense 사용)
 * @description SSR/Hydration이 필요한 컴포넌트에서 사용
 * @queryFn getUserData: 유저 정보 조회 서버 액션
 * @returns {user, isError, error}
 */
export function useUserData() {
    const { data, isError, error } = useSuspenseQuery({
        queryKey: userQuery.all(),
        queryFn: () => getUserData(),
    });

    return { user: data, isError, error };
}

/** 유저 정보를 조회하는 훅 (일반 Query 사용)
 * @description 드롭다운 등 클라이언트 전용 컴포넌트에서 사용
 * @queryFn getUserData: 유저 정보 조회 서버 액션
 * @returns {user, isLoading, isError, error}
 */
export function useUserDataForDropdown() {
    const { data, isLoading, isError, error } = useQuery({
        queryKey: userQuery.all(),
        queryFn: () => getUserData(),
        enabled: true,
    });

    return { user: data, isLoading, isError, error };
}