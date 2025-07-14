import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { userQuery } from '@/queries/supabase/user.query';
import { holdingsQuery } from '@/queries/supabase/holdings.query';
import { getUser } from '@/actions/supabase/getUser';
import { getHoldings } from '@/actions/supabase/getHoldings';
import React from 'react';

export default async function PrefetchUserAndHoldings({ children }: { children: React.ReactNode }) {
    const queryClient = new QueryClient();

    try {
        // 개별적으로 실패해도 앱이 동작하도록 Promise.allSettled 사용
        await Promise.allSettled([
            queryClient.prefetchQuery({ queryKey: userQuery.all(), queryFn: getUser, }),
            queryClient.prefetchQuery({ queryKey: holdingsQuery.all(), queryFn: getHoldings, })
        ]);
    } catch (error) {
        console.log('유저 데이터, 보유 자산 데이터 Prefetch 에러:', error);
    }

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            {children}
        </HydrationBoundary>
    );
}