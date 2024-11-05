import React from 'react';
import localFont from 'next/font/local';
import './globals.css';
import { ClientLayout } from './ClientLayout';
import { getFaviconUrl } from '@/features/Admin/Blog-settings/hooks/getFaviconUrl';

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

export async function generateMetadata() {
  const faviconUrl = await getFaviconUrl();
  return {
    title: {
      template: '%s | Clogging',
      default: 'Clogging',
    },
    icons: {
      icon: faviconUrl,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
