import { addMilliseconds } from 'date-fns';
import axios from './axios';
import { sessionStorageName } from '@/config';
import { User } from '@/types';
import { setCookie } from './cookies';
import { authUtils } from '@/hooks/useAuthManager';

export const refreshAccessToken = async () => {
  const response = await axios().get('/user/refreshToken');
  return response.data.data;
};

let refreshTimer: NodeJS.Timeout | null = null;

export const stopTokenRefreshTimer = () => {
  if (refreshTimer) {
    clearTimeout(refreshTimer);
    refreshTimer = null;
  }
};

export const startTokenRefreshTimer = (expirationTime: number, refreshToken: string) => {
  const expirationMinus120000 = Number(expirationTime) - 120000; // subtract 2 minutes
  const jwtExpirationTime = expirationMinus120000 <= 0 ? 1000 : expirationMinus120000;

  refreshTimer = setTimeout(async () => {
    try {
      const { token: newToken, ttl: newExpirationTime } = await refreshAccessToken();
      const tokenExpiration = addMilliseconds(new Date(), newExpirationTime);
      setCookie('ttl', tokenExpiration.toISOString(), tokenExpiration);

      if (typeof window !== 'undefined') {
        const currentSession = sessionStorage.getItem(sessionStorageName);
        if (currentSession) {
          const sessionObj: Partial<User> = JSON.parse(currentSession);
          sessionObj.token = newToken;
          sessionStorage.setItem(sessionStorageName, JSON.stringify(sessionObj));
        }
      }

      startTokenRefreshTimer(Number(newExpirationTime), newToken);
    } catch (error) {
      if (typeof window !== 'undefined') {
        authUtils.logout();
      }
    }
  }, jwtExpirationTime);
};
