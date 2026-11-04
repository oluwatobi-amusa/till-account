'use client';

import { BiMenu, BiX } from 'react-icons/bi';

interface MobileHeaderProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({ onToggleSidebar, isSidebarOpen }) => {
  return (
    <header className="flex items-center justify-between border-b border-gray-200 bg-white p-4 lg:hidden">
      <button
        onClick={onToggleSidebar}
        className="rounded-md p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
      >
        {isSidebarOpen ? <BiX size={24} /> : <BiMenu size={24} />}
      </button>
      <h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>
      <div></div> {/* Spacer for centering */}
    </header>
  );
};

export default MobileHeader;
