import { NextRequest, NextResponse } from 'next/server';
import { createMiddlewareSupabaseClient } from '@/utils/supabase/middleware';

const AUTH_ROUTES = {
    RECOVERY_ROUTES: ['/reset-password', '/reset-password/complete'],
    REQUIRE_AUTH: ['/history', '/my-assets'],
    BLOCK_IF_AUTH: ['/signin', '/signup', '/reset-password', '/reset-password/complete', '/auth/callback'],
};

export async function proxy(request: NextRequest) {
    const { pathname, searchParams } = new URL(request.url);

    // CSP 헤더 설정
    const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
    const cspHeader = `
        default-src 'self';
        script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live https://va.vercel-scripts.com https://www.googletagmanager.com https://t1.daumcdn.net;
        style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
        img-src 'self' blob: data: https://*.supabase.co https://static.upbit.com https://i.ytimg.com https://lh3.googleusercontent.com https://t1.daumcdn.net https://res.cloudinary.com;
        font-src 'self' https://fonts.gstatic.com data:;
        object-src 'none';
        base-uri 'self';
        form-action 'self';
        frame-ancestors 'none';
        frame-src 'self' https://www.youtube.com https://vercel.live;
        connect-src 'self' https://*.supabase.co https://api.upbit.com wss://*.supabase.co ${process.env.NEXT_PUBLIC_WEBSOCKET_SERVER || ''} ws://localhost:4000 wss://ezbit-websocket.onrender.com https://www.googleapis.com https://www.youtube.com https://dapi.kakao.com https://vercel.live https://va.vercel-scripts.com https://res.cloudinary.com https://api.cloudinary.com;
        media-src 'self' https://www.youtube.com https://res.cloudinary.com;
        worker-src 'self' blob:;
        upgrade-insecure-requests;
    `;

    const contentSecurityPolicyHeaderValue = cspHeader.replace(/\s{2,}/g, ' ').trim();

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-nonce', nonce);
    requestHeaders.set('Content-Security-Policy', contentSecurityPolicyHeaderValue);

    // 비밀번호 복구 플로우는 인증 체크 없이 바로 통과
    const isRecoveryFlow = AUTH_ROUTES.RECOVERY_ROUTES.some(route => pathname.startsWith(route)) || searchParams.get('type') === 'recovery';
    if (isRecoveryFlow) {
        const response = NextResponse.next({ request: { headers: requestHeaders } });
        response.headers.set('Content-Security-Policy', contentSecurityPolicyHeaderValue);
        return response;
    }

    // 인증이 필요한 경로가 아니고 인증 차단 경로도 아니면 Supabase 호출 없이 바로 통과
    const requiresAuth = AUTH_ROUTES.REQUIRE_AUTH.some(route => pathname.startsWith(route));
    const blockIfAuth = AUTH_ROUTES.BLOCK_IF_AUTH.some(route => pathname.startsWith(route));

    if (!requiresAuth && !blockIfAuth) {
        const response = NextResponse.next({ request: { headers: requestHeaders } });
        response.headers.set('Content-Security-Policy', contentSecurityPolicyHeaderValue);
        return response;
    }

    // 인증 상태 확인이 필요한 경우만 Supabase 호출
    const response = NextResponse.next({ request: { headers: requestHeaders } });
    response.headers.set('Content-Security-Policy', contentSecurityPolicyHeaderValue);

    const supabase = createMiddlewareSupabaseClient(request, response);
    const { data: { user } } = await supabase.auth.getUser();

    if (requiresAuth && !user) return NextResponse.redirect(new URL('/signin', request.url));
    if (blockIfAuth && user) return NextResponse.redirect(new URL('/exchange', request.url));

    return response;
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|eot)$).*)',
    ],
};
