import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from 'utils/supabase/server';
import { createInitialUser } from '@/actions/supabase/users/createInitialUser';

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code: string | null = searchParams.get('code');
    const next: string = searchParams.get('next') ?? '/exchange';

    if (code) {
        const supabase = await createServerSupabaseClient();
        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (!error) {
            // OAuth 로그인 성공 시 초기 유저 생성 (이미 존재하면 건너뜀)
            const userCreated = await createInitialUser();
            if (!userCreated) console.error('유저 정보 생성에 실패했습니다.');
            return NextResponse.redirect(`${origin}${next}`);
        }
    }

    return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}