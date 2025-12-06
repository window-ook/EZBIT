import { Metadata } from "next";
import { createServerSupabaseClient } from '@/utils/supabase/server';
import "./globals.css";
import React from "react";
import localFont from 'next/font/local';
import AuthProvider from '@/providers/AuthProvider';
import Providers from '@/providers/Providers';

const pretendard = localFont({
  src: '../fonts/PretendardVariable.woff2',
  display: 'swap',
  weight: '45 920',
  variable: '--font-pretendard',
  preload: false,
  fallback: ['system-ui', 'arial'],
});

const nexonLight = localFont({
  src: '../fonts/NEXONLv1GothicLight.ttf',
  display: 'swap',
  weight: '300',
  variable: '--font-nexon-light',
  preload: false,
  fallback: ['system-ui', 'arial'],
});

const nexonRegular = localFont({
  src: '../fonts/NEXONLv1GothicRegular.ttf',
  display: 'swap',
  weight: '400',
  variable: '--font-nexon-regular',
  preload: false,
  fallback: ['system-ui', 'arial'],
});

const nexonBold = localFont({
  src: '../fonts/NEXONLv1GothicBold.ttf',
  display: 'swap',
  weight: '700',
  variable: '--font-nexon-bold',
  preload: false,
  fallback: ['system-ui', 'arial'],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://ezbit.vercel.app'),
  title: "EZBIT",
  description: "스마트한 포트폴리오 파일럿과 함께하는 모의투자 서비스",
  keywords: [
    'EZBIT',
    'EZBIT 모의투자',
    'EZBIT 모의투자 서비스',
    '이지빗',
    '이지 빗'
  ],
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    title: 'EZBIT',
    siteName: 'EZBIT',
    description: '스마트한 포트폴리오 파일럿과 함께하는 모의투자 서비스',
    images: ['https://ezbit.vercel.app/opengraph-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EZBIT',
    description: '스마트한 포트폴리오 파일럿과 함께하는 모의투자 서비스',
    images: ['https://ezbit.vercel.app/opengraph-image.png'],
  },
  alternates: {
    canonical: 'https://ezbit.vercel.app'
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createServerSupabaseClient();

  const { data: { session } } = await supabase.auth.getSession();

  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="" />
        <link rel="dns-prefetch" href="//res.cloudinary.com" />
      </head>
      <body
        className={`${pretendard.variable} ${nexonLight.variable} ${nexonRegular.variable} ${nexonBold.variable} font-pretendard text-slate-900`}
      >
        <AuthProvider accessToken={session?.access_token || null}>
          <Providers>
            {children}
          </Providers>
        </AuthProvider>
      </body>
    </html>
  );
}