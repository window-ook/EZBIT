import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// 인증이 필요한 라우트 목록
const protectedRoutes = ['/my-assets', '/history', '/portfolio-pilot', '/exchange'];

// 인증된 사용자는 접근 불가한 라우트 
const authRoutes = ['/signin', '/signup'];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

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
        frame-src 'self' https://www.youtube.com;
        connect-src 'self' https://*.supabase.co https://api.upbit.com wss://*.supabase.co ${process.env.NEXT_PUBLIC_WEBSOCKET_SERVER || ''} https://www.googleapis.com https://www.youtube.com https://dapi.kakao.com https://vercel.live https://va.vercel-scripts.com https://res.cloudinary.com https://api.cloudinary.com;
        media-src 'self' https://www.youtube.com https://res.cloudinary.com;
        worker-src 'self' blob:;
        upgrade-insecure-requests;
    `;

    const contentSecurityPolicyHeaderValue = cspHeader.replace(/\s{2,}/g, ' ').trim();

    let supabaseResponse = NextResponse.next({ request: { headers: request.headers } });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    );
                    supabaseResponse = NextResponse.next({
                        request,
                    });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    const { data: { user } } = await supabase.auth.getUser();

    // 보호된 라우트 접근 시 인증 체크
    if (protectedRoutes.some((route) => pathname.startsWith(route))) {
        if (!user) {
            const url = request.nextUrl.clone();
            url.pathname = '/signin';
            url.searchParams.set('redirect', pathname);
            return NextResponse.redirect(url);
        }
    }

    // 인증된 사용자가 로그인/회원가입 페이지 접근 시 홈으로 리다이렉트
    if (authRoutes.some((route) => pathname.startsWith(route))) {
        if (user) {
            const url = request.nextUrl.clone();
            url.pathname = '/';
            return NextResponse.redirect(url);
        }
    }

    supabaseResponse.headers.set('Content-Security-Policy', contentSecurityPolicyHeaderValue);
    supabaseResponse.headers.set('x-nonce', nonce);
    supabaseResponse.headers.set('X-Frame-Options', 'DENY');
    supabaseResponse.headers.set('X-Content-Type-Options', 'nosniff');
    supabaseResponse.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    supabaseResponse.headers.set(
        'Permissions-Policy',
        'camera=(), microphone=(), geolocation=(), interest-cohort=()'
    );

    return supabaseResponse;
}

export const config = {
    matcher: [
        /*
         * 다음을 제외한 모든 요청 경로에 매칭:
         * - _next/static (정적 파일)
         * - _next/image (이미지 최적화 파일)
         * - favicon.ico (파비콘 파일)
         * - 이미지, 폰트 등 정적 리소스
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|eot)$).*)',
    ],
};
