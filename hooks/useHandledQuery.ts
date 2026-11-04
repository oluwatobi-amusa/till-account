'use client';

import { useEffect } from 'react';
import { useQuery, UseQueryOptions, QueryKey } from '@tanstack/react-query';
import { ApiResponse, HandleApiError, HandleApiSuccess } from '@/app/apiService/apiResponseHandler';

export const useHandledQuery = <T extends ApiResponse | undefined>(
  queryKey: QueryKey,
  queryFn: () => Promise<T>,
  options?: Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'>,
  showSuccessNotification = true
) => {
  const queryResult = useQuery({
    queryKey,
    queryFn,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchInterval: false,
    ...options
  });

  const { data, status, error, refetch } = queryResult;

  useEffect(() => {
    if (status === 'success' && data) {
      if (showSuccessNotification) {
        HandleApiSuccess(data);
      }
    }
    if (status === 'error') {
      HandleApiError(error as ApiResponse, refetch);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return queryResult;
};
