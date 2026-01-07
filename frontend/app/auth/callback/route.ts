import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from 'utils/supabase/server';
import { createInitialUser } from '@/actions/supabase/users/createInitialUser';
import { CONSOLE_ERROR } from '@/utils/constants/messages';

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code: string | null = searchParams.get('code');
    const next: string = searchParams.get('next') ?? '/exchange';

    if (code) {
        const supabase = await createServerSupabaseClient();
        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (!error) {
            // OAuth 로그인 성공 시 초기 유저 생성
            try {
                await createInitialUser();
            } catch (err) {
                console.error(CONSOLE_ERROR.INITIALIZE_NEW_USER_DATA_FAIL, err);
            }
            return NextResponse.redirect(`${origin}${next}`);
        }
    }

    return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}