'use client';

import { usePathname } from 'next/navigation';
import { ReduxProviders } from '@/store/provider';
import { useInitialRender } from '@/hooks';
import { ReloadProvider } from '@/hooks/useReloadContext';
import { DASHBOARD_ROUTE } from '@/config';
import { Toaster } from '@/components/ui/sonner';
import UseQueryProvider from './UseQuery';
import Auth from './hocLayout/Auth';

export function Providers({ children }: { children: React.ReactNode }) {
  // const pathname = usePathname();

  const isInitialRenderComplete = useInitialRender();

  if (!isInitialRenderComplete) return null;

  // const showHeaderNavigation = !DASHBOARD_ROUTE.some((route) => pathname.startsWith(route));
  return (
    <UseQueryProvider>
      <ReloadProvider>
        <ReduxProviders>
          {/* <Auth> */}
          {/* {showHeaderNavigation && <Header />} */}
          {children}
          {/* </Auth> */}
          <Toaster />
        </ReduxProviders>
      </ReloadProvider>
    </UseQueryProvider>
  );
}
