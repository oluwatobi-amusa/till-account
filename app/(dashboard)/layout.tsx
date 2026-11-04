'use client';

import { useState } from 'react';
import SideBar from '@/components/DashboardLayout/Sidebar';
import TopBar from '@/components/DashboardLayout/Topbar';
import HOCLayout from '../provider/hocLayout';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <HOCLayout />
      <div className="min-h-screen">
        <div className="fixed left-0 right-0 top-0 z-30 w-full">
          <TopBar onToggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        </div>

        <div className="flex min-h-screen pt-[60px]">
          <div className="w-0 flex-shrink-0 lg:w-44">
            <div className="fixed left-0 top-[60px] z-50 h-[calc(100vh-60px)] lg:relative lg:top-0">
              <SideBar isSidebarOpen={isSidebarOpen} onToggleSidebar={toggleSidebar} />
            </div>
          </div>

          <div className="flex min-w-0 flex-1 flex-col">
            <div className="relative min-h-[calc(100vh-60px)] bg-[#F0F2F5] p-3">{children}</div>
          </div>
        </div>
      </div>
    </>
  );
}
