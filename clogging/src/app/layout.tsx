import type { Metadata } from 'next';
import React from 'react';
import localFont from 'next/font/local';
import './globals.css';
import { Navigation } from '@/shared/ui/layout/Navigation';
import Link from 'next/link';
import { QueryProviders } from './QueryProviders';

const geistSans = localFont({
  src: '../../public/fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: '../../public/fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: {
    template: '%s | Clogging',
    default: 'Clogging',
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProviders>
          <Navigation />
          <main className="container">{children}</main>
          {/* 나중에 삭제 */}
          <Link
            href="/style-guide"
            className="flex items-center"
            style={{ position: 'fixed', bottom: '10px', right: '10px' }}
          >
            스타일 가이드
          </Link>
        </QueryProviders>
      </body>
    </html>
  );
}
