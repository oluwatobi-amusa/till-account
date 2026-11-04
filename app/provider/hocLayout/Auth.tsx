'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import Loader from '@/components/ui/Loader';
import { getCookie } from '@/app/utils/cookies';
import { logoutUser } from '@/store/slice/userService/userService';
import { DASHBOARD_ROUTE, GUEST_ROUTES } from '@/config';
import { toast } from 'sonner';

const Auth = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const expired = searchParams.get('expired');

  const [loader, setLoader] = useState(true);
  const ttlCookie = getCookie('ttl') ?? '';

  const dispatch = useAppDispatch();
  const {
    user: { isAuthenticated }
  } = useAppSelector((state) => state.userService);

  useEffect(() => {
    setTimeout(() => setLoader(false), 1500);
  }, []);

  const isDashboardRoute = (path: string) => {
    return DASHBOARD_ROUTE.some((route) => path.startsWith(route));
  };

  useEffect(() => {
    if (pathname === '/login' && expired === 'true') {
      router.replace('/login');
    }
    if (isAuthenticated && !ttlCookie) {
      dispatch(logoutUser());
      router.push('/login');
    } else if (!isAuthenticated && isDashboardRoute(pathname)) {
      router.push('/login');
    } else if (isAuthenticated && GUEST_ROUTES.includes(pathname)) {
      toast('Successful!', {
        description: 'You are logged in'
      });
      router.push('/dashboard');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, expired]);

  return loader ? <Loader /> : <div>{children}</div>;
};

export default Auth;
