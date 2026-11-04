'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef } from 'react';
import { stopTokenRefreshTimer, startTokenRefreshTimer } from '@/app/utils/token';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { useEffectOnce } from '@/hooks';
import { logoutUser } from '@/store/slice/userService/userService';
import { getCookie, getRemainingTTL, removeCookie } from '@/app/utils/cookies';
import { toast } from 'sonner';

const Token = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastActiveTimestampRef = useRef<number>(Date.now());
  const ttlCookie = getCookie('ttl') ?? '';

  const cookies = useMemo(() => ({ ttl: ttlCookie }), [ttlCookie]);

  const {
    user: { token, isAuthenticated, ttl: storedInitialTTL }
  } = useAppSelector((state) => state.userService);

  useEffectOnce(() => {
    const jwtExpirationTime = getRemainingTTL(cookies, 'ttl');
    if (jwtExpirationTime && token) {
      startTokenRefreshTimer(jwtExpirationTime, token);
    }
  });

  const checkTokenValidity = () => {
    if (!storedInitialTTL || !isAuthenticated) return;

    const currentTime = Date.now();
    const inactiveTime = currentTime - lastActiveTimestampRef.current;

    if (inactiveTime >= storedInitialTTL) {
      stopTokenRefreshTimer();
      dispatch(logoutUser());
      removeCookie('ttl');

      toast.error('Session Expired', {
        description: 'You have been logged out due to inactivity.',
        style: { color: 'white', backgroundColor: 'red' },
        closeButton: true,
        richColors: true
      });

      router.push('/login?expired=true');
    } else {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }

      inactivityTimerRef.current = setTimeout(() => {
        checkTokenValidity();
      }, storedInitialTTL - inactiveTime);
    }
  };

  useEffect(() => {
    if (!storedInitialTTL || !isAuthenticated) return;

    const handleUserActivity = () => {
      lastActiveTimestampRef.current = Date.now();

      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }

      inactivityTimerRef.current = setTimeout(() => {
        checkTokenValidity();
      }, storedInitialTTL);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkTokenValidity();
      }
    };

    const handleFocus = () => {
      checkTokenValidity();
    };

    const activityEvents = ['mousemove', 'keydown', 'touchstart', 'scroll', 'click'];

    activityEvents.forEach((event) => {
      window.addEventListener(event, handleUserActivity);
    });

    // Add visibility and focus event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    // Initialize timer and timestamp
    lastActiveTimestampRef.current = Date.now();
    handleUserActivity();

    return () => {
      activityEvents.forEach((event) => {
        window.removeEventListener(event, handleUserActivity);
      });

      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);

      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storedInitialTTL, isAuthenticated, dispatch, router]);

  return null;
};

export default Token;
