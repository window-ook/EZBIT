'use server';

import { createServerSupabaseClient } from '@/utils/supabase/server';
import { Database } from 'types_db';

export type UsersInsert = Database['public']['Tables']['users']['Insert'];

export async function createInitialUser() {
    const supabase = await createServerSupabaseClient();

    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase.from('users').insert<UsersInsert>({
        user_id: user?.id ?? '',
        holding_krw: 30000000,
        total_invested: 0,
        updated_at: new Date().toISOString(),
    });

    if (error) throw new Error(error.message);

    return true;
}