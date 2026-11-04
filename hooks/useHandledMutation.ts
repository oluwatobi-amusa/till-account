'use client';

import { ApiResponse, HandleApiError, HandleApiSuccess } from '@/app/apiService/apiResponseHandler';
import { useMutation } from '@tanstack/react-query';

export const useHandledMutation = <TData extends ApiResponse, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  successMessage?: string,
  onSuccessCallback?: (data: TData, variables: TVariables) => void,
  showSuccessNotification = true
) => {
  const mutation = useMutation<TData, any, TVariables>({
    mutationFn,
    onSuccess: (data, variables) => {
      if (showSuccessNotification) {
        HandleApiSuccess(data, successMessage);
      }
      onSuccessCallback?.(data, variables);
    },
    onError: (error, variables) => {
      HandleApiError(error, () => mutation.mutate(variables));
    }
  });

  return mutation;
};
