import { store } from '@/store';
import { logoutUser } from '@/store/slice/userService/userService';
import { stopTokenRefreshTimer } from '@/app/utils/token';

export const authUtils = {
  logout: () => {
    sessionStorage.clear();
    stopTokenRefreshTimer();
    store.dispatch(logoutUser());

    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }
};
