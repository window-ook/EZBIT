import React from "react";
import type { Metadata } from "next";
import "./globals.css";
import localFont from 'next/font/local';

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
  title: "EZBIT",
  description: "쉬운 모의투자 플랫폼",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${pretendard.variable} ${nexonLight.variable} ${nexonRegular.variable} ${nexonBold.variable} font-pretendard`}
      >
        {children}
      </body>
    </html>
  );
}
