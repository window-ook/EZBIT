import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from 'utils/supabase/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${requestUrl.origin}/exchange`);
  }

  return NextResponse.redirect(requestUrl.origin);
}