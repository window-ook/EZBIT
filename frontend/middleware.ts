import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
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
        connect-src 'self' https://*.supabase.co https://api.upbit.com wss://*.supabase.co ${process.env.NEXT_PUBLIC_WEBSOCKET_SERVER || ''} ws://localhost:4000 wss://ezbit.vercel.app:4000 https://www.googleapis.com https://www.youtube.com https://dapi.kakao.com https://vercel.live https://va.vercel-scripts.com https://res.cloudinary.com https://api.cloudinary.com;
        media-src 'self' https://www.youtube.com https://res.cloudinary.com;
        worker-src 'self' blob:;
        upgrade-insecure-requests;
    `;

    const contentSecurityPolicyHeaderValue = cspHeader.replace(/\s{2,}/g, ' ').trim();

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-nonce', nonce);
    requestHeaders.set('Content-Security-Policy', contentSecurityPolicyHeaderValue);

    const response = NextResponse.next({ request: { headers: requestHeaders } });
    response.headers.set('Content-Security-Policy', contentSecurityPolicyHeaderValue);

    return response;
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
