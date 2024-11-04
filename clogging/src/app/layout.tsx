import React from 'react';
import localFont from 'next/font/local';
import './globals.css';
import { Navigation } from '@/shared/ui/layout/Navigation';
import Link from 'next/link';
import { QueryProviders } from './queryProviders';

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

const faviconUrl =
  'https://firebasestorage.googleapis.com/v0/b/clogging-d3b17.appspot.com/o/settings%2Ffavicons%2Fclogging.ico?alt=media&token=818d7961-b7be-485a-b988-09f4722e9182';
export const metadata = {
  title: {
    template: '%s | Clogging',
    default: 'Clogging',
  },
  icons: {
    icon: faviconUrl, // Firebase Storage의 favicon URL
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
