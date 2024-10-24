'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { type ReactNode } from 'react';
import Image from 'next/image';

interface StyleWrapperProps {
  children: ReactNode;
}

interface DarkModeImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
  'aria-hidden'?: boolean;
}

export function DarkModeImage({
  className = '',
  ...props
}: DarkModeImageProps) {
  const { isDarkMode } = useTheme();
  return (
    <Image
      className={`${isDarkMode ? 'invert' : ''} ${className}`}
      {...props}
    />
  );
}

export function HomeStyleWrapper({ children }: StyleWrapperProps) {
  const { isDarkMode } = useTheme();

  return (
    <div
      className={`grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] ${
        isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
      }`}
    >
      {children}
    </div>
  );
}

export function CodeBlock({ children }: { children: ReactNode }) {
  const { isDarkMode } = useTheme();

  return (
    <code
      className={`px-1 py-0.5 rounded font-semibold ${
        isDarkMode ? 'bg-white/[.06]' : 'bg-black/[.05]'
      }`}
    >
      {children}
    </code>
  );
}

export function DeployButton() {
  const { isDarkMode } = useTheme();

  return (
    <a
      className={`rounded-full border border-solid border-transparent transition-colors flex items-center justify-center gap-2 text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 ${
        isDarkMode
          ? 'bg-white text-gray-900 hover:bg-gray-200'
          : 'bg-gray-900 text-white hover:bg-gray-800'
      }`}
      href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
      target="_blank"
      rel="noopener noreferrer"
    >
      <DarkModeImage
        src="/vercel.svg"
        alt="Vercel logomark"
        width={20}
        height={20}
      />
      Deploy now
    </a>
  );
}

export function DocsButton() {
  const { isDarkMode } = useTheme();

  return (
    <a
      className={`rounded-full border border-solid transition-colors flex items-center justify-center text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44 ${
        isDarkMode
          ? 'border-white/[.145] hover:bg-gray-800'
          : 'border-black/[.08] hover:bg-gray-100'
      }`}
      href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
      target="_blank"
      rel="noopener noreferrer"
    >
      Read our docs
    </a>
  );
}

export function FooterLink({
  href,
  icon,
  text,
}: {
  href: string;
  icon: string;
  text: string;
}) {
  const { isDarkMode } = useTheme();

  return (
    <a
      className={`flex items-center gap-2 hover:underline hover:underline-offset-4 ${
        isDarkMode ? 'text-gray-300' : 'text-gray-600'
      }`}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      <DarkModeImage
        aria-hidden
        src={icon}
        alt={`${text} icon`}
        width={16}
        height={16}
      />
      {text}
    </a>
  );
}
