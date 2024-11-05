import { ReactNode } from 'react';

export interface AdminLayoutProps {
  children: ReactNode;
}

export interface MenuItem {
  name: string;
  icon: string;
  activeIcon: string;
  href: string;
}
