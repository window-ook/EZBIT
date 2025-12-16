Supabase Authentication 관리 구조 개선 계획

 개요

 proxy.ts와 AuthProvider.tsx의 역할을 명확히 분리하여 최적의 인증 관리 구조를 구현합니다.

 핵심 결정 사항

 상태 관리 방식

 - ❌ Zustand 스토어 사용 안 함
 - ✅ 기존 TanStack Query 구조 유지
   - useUserData 훅이 이미 users 테이블의 전체 데이터를 관리
   - AuthProvider는 인증 상태 변경 감지 및 캐시 무효화만 담당

 역할 분담

 proxy.ts (서버 사이드 - 미들웨어 단계)

 - CSP 보안 헤더 설정 (현재 기능 유지)
 - 인증 라우팅 처리 (신규 추가)
   - Supabase 미들웨어 클라이언트로 사용자 인증 상태 확인
   - AUTH_ROUTES 설정에 따라 접근 제어
   - 비밀번호 복구 플로우 예외 처리

 AuthProvider.tsx (클라이언트 사이드)

 - 인증 상태 동기화 (역할 변경)
   - onAuthStateChange 리스너로 실시간 인증 상태 감지
   - 로그인/로그아웃 시 TanStack Query 캐시 무효화
   - 라우팅 로직 제거 (proxy.ts로 이관)
   - 상태 저장 안 함 (TanStack Query가 담당)

 layout.tsx

 - 변경 없음 (삭제 예정)
   - 현재 initialUserId, initialUserEmail을 전달하지만 사용되지 않음
   - AuthProvider에서 props를 받지 않도록 수정

 구현 단계

 1. proxy.ts 수정

 파일: proxy.ts

 추가 사항:
 - createMiddlewareSupabaseClient import
 - AUTH_ROUTES 설정 추가
 - 인증 상태 확인 및 라우팅 로직 추가

 구현 내용:
 import { NextRequest, NextResponse } from 'next/server';
 import { createMiddlewareSupabaseClient } from '@/utils/supabase/middleware';

 const AUTH_ROUTES = {
   RECOVERY_ROUTES: ['/reset-password', '/reset-password/complete'],
   REQUIRE_AUTH: ['/history', '/my-assets'],
   BLOCK_IF_AUTH: ['/signin', '/signup', '/reset-password', '/reset-password/complete', '/auth/callback'],
 };

 export async function proxy(request: NextRequest) {
   const { pathname, searchParams } = new URL(request.url);

   // CSP 헤더 설정 (기존 코드)
   const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
   const cspHeader = `
     default-src 'self';
     script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.kakao.com https://dapi.kakao.com https://t1.daumcdn.net https://*.vercel.live
  https://vercel.live https://*.vercel-scripts.com https://static.cloudflareinsights.com;
     style-src 'self' 'unsafe-inline';
     img-src 'self' blob: data: https://*.kakao.com https://*.kakaocdn.net https://lh3.googleusercontent.com 
 https://avatars.githubusercontent.com https://t1.daumcdn.net https://mts.daumcdn.net https://*.supabase.co;
     font-src 'self' https://fonts.gstatic.com;
     connect-src 'self' https://*.supabase.co https://*.kakao.com https://dapi.kakao.com https://*.vercel.live https://vercel.live 
 https://cloudflareinsights.com https://*.cloudflareinsights.com;
     object-src 'none';
     base-uri 'self';
     form-action 'self' https://*.kakao.com;
     frame-ancestors 'none';
     frame-src https://*.vercel.live https://vercel.live https://*.kakao.com;
     upgrade-insecure-requests;`;

   const contentSecurityPolicyHeaderValue = cspHeader.replace(/\s{2,}/g, ' ').trim();

   const requestHeaders = new Headers(request.headers);
   requestHeaders.set('x-nonce', nonce);
   requestHeaders.set('Content-Security-Policy', contentSecurityPolicyHeaderValue);

   const response = NextResponse.next({ request: { headers: requestHeaders } });
   response.headers.set('Content-Security-Policy', contentSecurityPolicyHeaderValue);

   // 인증 로직 추가
   const supabase = createMiddlewareSupabaseClient(request, response);
   const { data: { user } } = await supabase.auth.getUser();

   const isRecoveryFlow = AUTH_ROUTES.RECOVERY_ROUTES.some(route => pathname.startsWith(route)) || searchParams.get('type') === 'recovery';
   if (isRecoveryFlow) return response;

   const requiresAuth = AUTH_ROUTES.REQUIRE_AUTH.some(route => pathname.startsWith(route));
   if (requiresAuth && !user) return NextResponse.redirect(new URL('/signin', request.url));

   const blockIfAuth = AUTH_ROUTES.BLOCK_IF_AUTH.some(route => pathname.startsWith(route));
   if (blockIfAuth && user) return NextResponse.redirect(new URL('/main', request.url));

   return response;
 }

 export const config = {
   matcher: [
     '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|eot)$).*)',
   ],
 };

 2. AuthProvider.tsx 수정

 파일: providers/AuthProvider.tsx

 주요 변경:
 - 인터페이스에서 accessToken 제거, props 자체를 제거
 - RULES 및 라우팅 로직 완전 제거 (proxy.ts로 이관)
 - TanStack Query 캐시 무효화 추가
 - 라우터 및 pathname 관련 코드 제거

 구현 내용:
 'use client';

 import { ReactNode, useEffect, useMemo } from 'react';
 import { useQueryClient } from '@tanstack/react-query';
 import { createBrowserSupabaseClient } from '@/utils/supabase/client';
 import { userQuery } from '@/queries/supabase/users.query';

 export interface IAuthProvider {
   children: ReactNode;
 }

 export default function AuthProvider({ children }: IAuthProvider) {
   const supabase = useMemo(() => createBrowserSupabaseClient(), []);
   const queryClient = useQueryClient();

   useEffect(() => {
     const {
       data: { subscription: authListener },
     } = supabase.auth.onAuthStateChange(async (event, session) => {
       if (session?.user) {
         // 로그인 시 user 쿼리 무효화하여 최신 데이터 가져오기
         queryClient.invalidateQueries({ queryKey: userQuery.all() });
       } else {
         // 로그아웃 시 user 쿼리 초기화
         queryClient.resetQueries({ queryKey: userQuery.all() });
       }
     });

     return () => {
       authListener.unsubscribe();
     };
   }, [supabase, queryClient]);

   return children;
 }

 3. layout.tsx 수정

 파일: app/layout.tsx

 주요 변경:
 - Supabase 클라이언트 생성 및 사용자 조회 로직 제거
 - AuthProvider에 props 전달하지 않음

 수정 내용:
 // 삭제할 코드:
 const supabase = await createServerSupabaseClient();
 const { data: { user } } = await supabase.auth.getUser();

 let initialUserId: string | null = null;
 let initialUserEmail: string | null = null;

 if (user) {
   initialUserId = user.id;
   initialUserEmail = user.email ?? null;
 }

 // 수정 전:
 <AuthProvider
   initialUserId={initialUserId}
   initialUserEmail={initialUserEmail}
 >

 // 수정 후:
 <AuthProvider>

 4. utils/supabase/middleware.ts

 파일: utils/supabase/middleware.ts

 변경 사항: 없음 (그대로 유지)
 - proxy.ts에서 사용하므로 현재 구현 유지

 핵심 개선 사항

 1. 명확한 책임 분리
   - proxy.ts: 서버 사이드 인증 라우팅 및 CSP 설정
   - AuthProvider.tsx: 클라이언트 사이드 인증 상태 감지 및 캐시 무효화
   - TanStack Query: 사용자 데이터 관리 (기존 구조 유지)
 2. 중복 제거
   - 기존 AuthProvider의 라우팅 로직을 proxy.ts로 이관하여 중복 제거
   - 서버 사이드에서 먼저 차단하므로 더 안전함
   - 불필요한 초기 사용자 정보 전달 제거
 3. 성능 최적화
   - 불필요한 클라이언트 사이드 리다이렉트 제거
   - 서버 사이드에서 먼저 처리하여 초기 로딩 개선
   - layout.tsx에서 불필요한 Supabase 호출 제거
 4. 타입 안정성
   - interface 이름 규칙 준수 (I- 접두사)
   - 미사용 props 완전 제거
 5. 데이터 흐름 단순화
   - TanStack Query가 서버 상태 관리
   - AuthProvider는 인증 이벤트만 감지하여 캐시 무효화
   - Zustand 없이 기존 아키텍처 유지

 데이터 흐름

 1. 사용자 접속
    ↓
 2. proxy.ts (미들웨어)
    - 인증 상태 확인
    - 라우팅 제어 (인증 필요/차단)
    ↓
 3. layout.tsx
    - AuthProvider 마운트 (props 없음)
    ↓
 4. AuthProvider
    - onAuthStateChange 리스너 등록
    ↓
 5. 컴포넌트에서 useUserData() 사용
    - TanStack Query가 서버 액션 호출
    - 캐싱 및 데이터 관리
    ↓
 6. 인증 상태 변경 시
    - AuthProvider가 감지
    - TanStack Query 캐시 무효화/초기화
    - 컴포넌트 자동 리렌더링

 수정할 파일 목록

 1. ✅ proxy.ts - CSP + 인증 라우팅 추가
 2. ✅ providers/AuthProvider.tsx - 라우팅 제거, 캐시 무효화 추가
 3. ✅ app/layout.tsx - Supabase 호출 제거, props 제거
 4. ⚠️ frontend/middleware.ts - 이미 삭제됨 (git status 확인)

 패키지 설치

 불필요 - Zustand를 사용하지 않으므로 추가 패키지 설치 없음