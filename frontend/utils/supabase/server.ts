'use server';

import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Database } from 'types_db';

export const createServerSupabaseClient = async (
    cookieStore?: Awaited<ReturnType<typeof cookies>>,
    admin: boolean = false,
) => {
    // Promise<ReadonlyRequestCookies>를 반환하므로 결과값을 await하여 resolved된 쿠키 스토어를 사용해야한다
    const resolvedCookieStore = cookieStore || (await cookies());

    return createServerClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        admin
            ? process.env.NEXT_SUPABASE_SERVICE_ROLE!
            : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return resolvedCookieStore.get(name)?.value;
                },
                set(name: string, value: string, options: CookieOptions) {
                    try {
                        resolvedCookieStore.set({ name, value, ...options });
                    } catch (error) {
                        console.error(error);
                        // The `set` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing
                        // user sessions.
                    }
                },
                remove(name: string, options: CookieOptions) {
                    try {
                        resolvedCookieStore.set({ name, value: '', ...options });
                    } catch (error) {
                        console.error(error);
                        // The `delete` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing
                        // user sessions.
                    }
                },
            },
        },
    );
};

export const createServerSupabaseAdminClient = async (
    cookieStore?: Awaited<ReturnType<typeof cookies>>,
) => {
    const resolvedCookieStore = cookieStore || (await cookies());
    return createServerSupabaseClient(resolvedCookieStore, true);
};
