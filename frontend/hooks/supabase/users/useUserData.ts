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
        queryFn: async () => {
            const result = await getUserData();
            if (!result.success) throw new Error(result.message || '유저 정보 조회에 실패했습니다.');
            return result.data;
        },
    });

    return { user: data, isError, error };
}

/** 유저 정보를 조회하는 훅 (일반 Query 사용)
 * @description 드롭다운 등 클라이언트 전용 컴포넌트에서 사용
 * @queryFn getUserData: 유저 정보 조회 서버 액션
 * @returns {user, isPending, isError, error}
 */
export function useUserDataForDropdown() {
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