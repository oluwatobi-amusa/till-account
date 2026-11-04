'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FC } from 'react';
import { LINKS, LINK_ICON_STYLE } from './constants';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

interface SidebarProps {
  isSidebarOpen?: boolean;
  onToggleSidebar?: () => void;
}

const Sidebar: FC<SidebarProps> = ({ isSidebarOpen = true, onToggleSidebar }) => {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-x-0 bottom-0 top-[60px] z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={onToggleSidebar}
        />
      )}

      <div
        className={cn(
          'fixed left-0 top-[60px] z-50 flex h-[calc(100vh-60px)] w-44 flex-col border-r border-gray-100 bg-white transition-transform duration-300 ease-in-out lg:relative lg:top-0 lg:h-[calc(100vh-60px)] lg:translate-x-0',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex-1 overflow-y-auto px-2 py-3">
          <div className="space-y-1">
            {LINKS.map((link) => {
              const SideBarIcon = link.icon;
              const isActive = pathname.startsWith(link.url);

              return (
                <Link
                  href={link.url}
                  key={link.name}
                  onClick={() => {
                    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
                      onToggleSidebar?.();
                    }
                  }}
                >
                  <div
                    className={cn(
                      'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-50',
                      isActive && 'text-[#009148]'
                    )}
                  >
                    <SideBarIcon
                      style={LINK_ICON_STYLE}
                      className={cn('text-gray-900', isActive && 'text-[#009148]')}
                    />
                    <span className="truncate">{link.name}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        <button
          type="button"
          aria-label="Close navigation"
          onClick={onToggleSidebar}
          className="absolute right-2 top-2 p-1 text-gray-500 lg:hidden"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </>
  );
};

export default Sidebar;
