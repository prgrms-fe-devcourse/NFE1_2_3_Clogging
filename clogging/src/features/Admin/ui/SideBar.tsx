'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/shared/providers/theme';
import { menuItems } from '../constants';

export const Sidebar = () => {
  const { isDarkMode } = useTheme();
  const pathname = usePathname();

  return (
    <div
      className={`${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white'} w-full lg:w-64 p-4`}
    >
      <h1 className="pb-4 text-2xl font-bold mb-6 border-b-2 border-[#636a99]">
        Admin
      </h1>
      <nav>
        <ul
          className={`flex flex-wrap md:flex-nowrap md:flex-col gap-2 md:gap-4 text-sm ${
            isDarkMode ? 'text-gray-400' : 'text-[#A3AED0]'
          }`}
        >
          {menuItems.map((item) => (
            <li key={item.name} className="w-auto md:w-full mb-2 md:mb-0 mr-4">
              <Link href={item.href}>
                <div
                  className={`flex items-center whitespace-nowrap ${
                    pathname === item.href
                      ? isDarkMode
                        ? 'text-white font-bold'
                        : 'text-[#2B3674] font-bold'
                      : isDarkMode
                        ? 'text-gray-400'
                        : 'text-[#A3AED0]'
                  }`}
                >
                  <div className="w-[26px] h-[26px] mr-3 flex items-center justify-center">
                    <Image
                      src={
                        isDarkMode
                          ? item.icon
                          : pathname === item.href
                            ? item.activeIcon
                            : item.icon
                      }
                      alt={item.name}
                      width={26}
                      height={26}
                    />
                  </div>
                  <div>{item.name}</div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};
