import React from 'react';
import localFont from 'next/font/local';
import './globals.css';
import { ClientLayout } from './ClientLayout';

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
    <html lang="en" className="dark:bg-gray-900">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased dark:bg-gray-900 min-h-screen`}
      >
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
