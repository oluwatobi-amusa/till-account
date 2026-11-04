import { IconType } from 'react-icons/lib';
import { HiOutlineBanknotes } from 'react-icons/hi2';

export const LINK_ICON_STYLE = { height: '20px', width: '20px' };

export type SideBarLink = {
  icon: IconType;
  name: string;
  url: string;
};

export type SideBarLinks = SideBarLink[];

export const LINKS: SideBarLinks = [
  {
    name: 'Till Accounts',
    url: '/till-accounts',
    icon: HiOutlineBanknotes
  }
];
