'use client';

import { BiMenu } from 'react-icons/bi';
import { ChevronsUpDown } from 'lucide-react';
import { useAppSelector } from '@/store/hooks';
import { initialTillState } from '@/app/(dashboard)/till-accounts/model';

interface TopBarProps {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

const TopBar: React.FC<TopBarProps> = ({ onToggleSidebar }) => {
  const { user } = useAppSelector((state) => state.userService);
  const businessName = initialTillState.accounts[0]?.business ?? 'Business name';
  const userName = user.name || user.email || 'Administrator';

  return (
    <header className="flex h-[60px] items-stretch border-b border-gray-200 bg-white">
      <div className="flex w-44 flex-shrink-0 items-center gap-2 border-r border-gray-100 px-3">
        <button
          onClick={onToggleSidebar}
          aria-label="Toggle navigation"
          className="rounded-md p-1 text-gray-600 hover:bg-gray-100 hover:text-gray-900 lg:hidden"
        >
          <BiMenu size={18} />
        </button>
        <div className="flex min-w-0 flex-1 items-center justify-between gap-1">
          <span className="truncate text-xs font-semibold text-gray-900">Business name</span>
          <ChevronsUpDown className="h-4 w-4 flex-shrink-0 text-gray-700" />
        </div>
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-center px-4">
        <p className="truncate text-sm font-bold text-gray-950">{businessName}.</p>
        <p className="truncate text-xs text-gray-500">{userName}</p>
      </div>
    </header>
  );
};

export default TopBar;
