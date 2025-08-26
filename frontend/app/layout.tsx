import type { Metadata } from "next";
import React from "react";
import "./globals.css";
import localFont from 'next/font/local';
import Providers from '@/providers/Providers';

const pretendard = localFont({
  src: '../fonts/PretendardVariable.woff2',
  display: 'swap',
  weight: '45 920',
  variable: '--font-pretendard',
  preload: true,
  fallback: ['system-ui', 'arial'],
});

const nexonLight = localFont({
  src: '../fonts/NEXONLv1GothicLight.ttf',
  display: 'swap',
  weight: '300',
  variable: '--font-nexon-light',
  preload: true,
});

const nexonRegular = localFont({
  src: '../fonts/NEXONLv1GothicRegular.ttf',
  display: 'swap',
  weight: '400',
  variable: '--font-nexon-regular',
  preload: true,
});

const nexonBold = localFont({
  src: '../fonts/NEXONLv1GothicBold.ttf',
  display: 'swap',
  weight: '700',
  variable: '--font-nexon-bold',
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
  ),
  title: "EZBIT",
  description: "스마트한 포트폴리오 파일럿과 함께하는 모의투자 플랫폼",
  keywords: [
    'EZBIT',
    'EZBIT 모의투자',
    'EZBIT 모의투자 플랫폼',
    'EZBIT 모의투자 플랫폼 사용법',
    'EZBIT 모의투자 플랫폼 활용',
  ],
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    title: 'EZBIT',
    siteName: 'EZBIT',
    description: '스마트한 포트폴리오 파일럿과 함께하는 모의투자 플랫폼',
    images: ['https://ezbit.vercel.app/opengraph-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EZBIT',
    description: '스마트한 포트폴리오 파일럿과 함께하는 모의투자 플랫폼',
    images: ['https://ezbit.vercel.app/opengraph-image.png'],
  },
  alternates: {
    canonical: '/',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="" />
        <link rel="dns-prefetch" href="//res.cloudinary.com" />
      </head>
      <body
        className={`${pretendard.variable} ${nexonLight.variable} ${nexonRegular.variable} ${nexonBold.variable} font-pretendard text-slate-900`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}